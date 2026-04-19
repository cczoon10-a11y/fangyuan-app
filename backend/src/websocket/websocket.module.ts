import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Module, Logger, Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';

@Injectable()
@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'realtime',
})
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(RealtimeGateway.name);
  private clientMap = new Map<string, { userId: number; type: string }>();

  constructor(private jwt: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token = (client.handshake.auth?.token || client.handshake.query?.token) as string;
      if (!token) {
        client.disconnect();
        return;
      }
      const payload = this.jwt.verify(token);
      this.clientMap.set(client.id, { userId: payload.sub, type: payload.type });
      client.join(`${payload.type}:${payload.sub}`);
      this.logger.log(`✓ ${payload.type}#${payload.sub} connected`);
    } catch (e) {
      this.logger.warn(`✗ Auth failed: ${e.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.clientMap.delete(client.id);
  }

  @SubscribeMessage('ping')
  ping(@ConnectedSocket() client: Socket) {
    return { event: 'pong', data: Date.now() };
  }

  /** 对外发送 - 推送给特定用户 */
  notify(type: 'user' | 'agent' | 'admin', id: number, event: string, payload: any) {
    this.server.to(`${type}:${id}`).emit(event, payload);
  }

  /** 广播到所有管理员 */
  notifyAllAdmins(event: string, payload: any) {
    this.server.to('broadcast:admins').emit(event, payload);
  }
}

@Module({
  imports: [AuthModule],
  providers: [RealtimeGateway],
  exports: [RealtimeGateway],
})
export class WebsocketModule {}
