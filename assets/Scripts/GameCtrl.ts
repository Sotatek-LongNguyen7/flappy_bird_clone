import {
    CCInteger,
    Collider2D,
    Component,
    Contact2DType,
    IPhysics2DContact,
    Node,
    _decorator,
    director
} from "cc";
const { ccclass, property } = _decorator;
// file này đóng vai trò điều khiển và quản lý toàn bộ game

import { Bird } from "./Bird";
import { BirdAudio } from "./BirdAudio";
import { Ground } from "./Ground";
import { PipePool } from "./PipePool";
import { Results } from "./Results";

@ccclass("GameCtrl")
export class GameCtrl extends Component {
  //tham chiếu đối tượng ground
  @property({
    type: Ground,
    tooltip: "This is Ground",
  })
  public ground: Ground;

  //tham chiếu đối tượng result
  @property({
    type: Results,
    tooltip: "Result go here",
  })
  public result: Results;

  //tham chiếu đối tượng bird
  @property({
    type: Bird,
  })
  public bird: Bird;

  //tham chiếu đối tượng pipepool
  @property({
    type: PipePool,
  })
  public pipeQueue: PipePool;

  //tốc độ game
  @property({
    type: CCInteger,
  })
  public speed: number = 300;

  @property({
    type: BirdAudio,
  })
  public clip: BirdAudio;

  //tốc độ ống
  @property({
    type: CCInteger,
  })
  public pipeSpeed: number = 200;

  //kiểm tra gameover hay chưa
  public isOver: boolean;

  
  onLoad() { // được gọi khi component được tải lên
    this.initListener(); // khởi tạo lắng nghe sự kiện
    this.result.resetScore(); // đặt lại điểm số về 0
    this.isOver = true; // đặt lại trạng thái game đã kết thúc
    director.pause(); //  tạm dừng trò chơi
  }

  initListener() { // lắng nghe sự kiện touch cho node 
    // input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    this.node.on(Node.EventType.TOUCH_START, () => { // khi người chơi chạm vào màn hình
      if (this.isOver == true) { // nếu trò chơi đã kết thúc
        this.resetGame(); // gọi resetGame => reset lại điểm số về 0, xoá toàn bộ pool, bắt đầu game
        this.bird.resetBird(); // đặt lại con chim về vị trí giữa màn hình x = 0, y = 0, z = 0
        this.startGame(); // bắt đầu game
      }
      if (this.isOver == false) {// nếu game chưa kết thúc
        this.bird.fly(); // thực hiện hành động cho con chim bay lên
        this.clip.onAudioQueue(0) // phát âm thanh lúc bay lên
      }
    });
  }

  //   onKeyDown(event: EventKeyboard) {
  //     switch (event.keyCode) {
  //       case KeyCode.KEY_A:
  //         this.gameOver();
  //         break;
  //       case KeyCode.KEY_P:
  //         this.result.addScore();
  //         break;
  //       case KeyCode.KEY_Q:
  //         this.resetGame();
  //         this.bird.resetBird();
  //     }
  //   }

  startGame() { // bắt đầu game
    this.result.hideResults(); // ẩn kết quả
    director.resume(); // tiếp tục trò chơi
  }

  gameOver() { // kết thúc game
    this.result.showResults(); // hiện kết quả gồm điểm cao nhất và điểm của ván này
    this.isOver = true; 
    this.clip.onAudioQueue(3)// phát âm thanh lúc kết thúc game
    director.pause(); // tạm dừng trò chơi
  }

  resetGame() { // reset game
    this.result.resetScore(); // reset điểm về 0 và ẩn kết quả
    this.pipeQueue.reset(); // xoá toàn bộ pool
    this.isOver = false; 
    this.startGame(); // bắt đầu lại game
  }

  passPipe() {  // khi ăn điểm
    this.result.addScore(); // + 1 điểm hiện tại
    this.clip.onAudioQueue(1) // phát âm thanh ăn điểm
  }

  createPipe() { // tạo pipe mới
    this.pipeQueue.addPool(); 
  }

  contactGroundPipe() { // lắng nghe sự kiện tác động vật lý giữa con chim và mặt đất
    let collider = this.bird.getComponent(Collider2D);

    if (collider) { // nếu có va chạm thì gọi hàm  onBeginContact
      collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }
  }

  onBeginContact(
    selfCollider: Collider2D,
    otherCollider: Collider2D,
    contact: IPhysics2DContact | null
  ) {
    this.bird.hitSomething = true; //đặt hitSomething = true
    this.clip.onAudioQueue(2) // bật tiếng khi va chạm
  }

  birdStruck() {
    this.contactGroundPipe(); // kiểm tra xem chim đã chạm đất hoặc ống chưa

    if (this.bird.hitSomething == true) {
      this.gameOver();
    }
  }

  update() { //gọi liên tục trong mỗi khung hình
    if (this.isOver == false) { // kiểm tra xem gameOver chưa
      this.birdStruck(); // gọi birdStruck
    }
  }
}
