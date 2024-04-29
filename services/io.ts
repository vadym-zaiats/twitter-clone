import { Server } from "socket.io";

export class IoService {
  private static instance: IoService;
  public io: Server;
  private WS_PORT: number;

  constructor() {
    this.WS_PORT = Number(process.env.PORT) || 8001;
    this.io = new Server({ cors: { origin: "*" } });
  }

  public ws() {
    this.io.listen(this.WS_PORT);
    this.io.on("connection", (socket) => {
      console.log(`User ${socket.id} connected`);

      socket.on("disconnect", () => {
        console.log(`User ${socket.id} disconnected`);
      });
    });
  }

  public static getInstance(): IoService {
    if (!IoService.instance) {
      IoService.instance = new IoService();
    }
    return IoService.instance;
  }
}

export default IoService.getInstance();
