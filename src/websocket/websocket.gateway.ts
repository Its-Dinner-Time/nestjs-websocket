import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';

@WebSocketGateway(667, {
  namespace: 'chat',
  cors: {
    origin: '*',
  },
})
export class WebsocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger('Gateway');

  @WebSocketServer() server: Namespace;

  afterInit() {
    this.logger.log('웹소켓 서버 초기화 ✅');
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    this.logger.log(`${socket.id} 소켓 연결`);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.logger.log(`${socket.id} 소켓 연결 해제 ❌`);
  }

  @SubscribeMessage('count')
  handleCount(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`message subscribed`);
    this.server.emit('count-client', message);
    return { username: client.id, message };
  }

  @SubscribeMessage('enterRoom')
  enterRoom(
    @MessageBody() roomId: string, //
    @ConnectedSocket() client: Socket,
  ) {
    client.join(roomId);
  }
}
