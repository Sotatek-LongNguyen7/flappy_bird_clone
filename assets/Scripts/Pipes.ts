import {
  _decorator,
  Component,
  find,
  Node,
  screen,
  UITransform,
  Vec3,
} from "cc";
const { ccclass, property } = _decorator;

// random 1 số nằm trong khoảng từ min đến max
const random = (min, max) => {
  return Math.random() * (max - min) + min;
};

@ccclass("Pipes")
export class Pipes extends Component {

  //tham chiếu đến ống trên
  @property({
    type: Node,
    tooltip: "Top Pipe",
  })
  public topPipe: Node;

  //tham chiếu đến ống dưới
  @property({
    type: Node,
    tooltip: "Bottom Pipe",
  })
  public bottomPipe: Node;

  //các vị trí tạm thời cho ống trên và dưới
  public tempStartLocationUp: Vec3 = new Vec3(0, 0, 0);
  public tempStartLocationDown: Vec3 = new Vec3(0, 0, 0);
  public scene = screen.windowSize;


  public game; // tốc độ của ống từ GameCtrl
  public pipeSpeed: number; // tốc độ cuối cùng của ống
  public tempSpeed: number; // tốc độ tạm thời

  isPass: boolean;

  onLoad() {
    this.game = find("GameCtrl").getComponent("GameCtrl"); //tìm GameCtrl và gán cho thuộc tính game 
    this.pipeSpeed = this.game.pipeSpeed; //gán tốc độ ống = tốc độ ống trong GameCtrl 
    this.initPos(); //gọi initPos để khởi tạo vị trí ban đầu của ống
    this.isPass = false;
  }

  initPos() {
    // gán vị trí theo chiều x của ống bằng chiều rộng của ống + chiều rộng của màn hình để ống nằm ngoài màn hình 
    this.tempStartLocationUp.x =
      this.topPipe.getComponent(UITransform).width + this.scene.width;

    this.tempStartLocationDown.x =
      this.topPipe.getComponent(UITransform).width + this.scene.width;

    // tạo một số ngẫu nhiên trong khoảng 90 - 100 và gán vào biến gap
    let gap = random(90, 100);

    // chiều cao của ống trên so với màn hình
    let topHeight = random(0, 450);

    this.tempStartLocationUp.y = topHeight; // đặt vị trí y của ống trên = giá trị random từ 0 - 450
    this.tempStartLocationDown.y = topHeight - gap * 10;

    this.bottomPipe.setPosition(this.tempStartLocationDown);
    this.topPipe.setPosition(this.tempStartLocationUp);
  }

  update(deltaTime) {
    this.tempSpeed = this.pipeSpeed * deltaTime; //tính toán tốc độ tạm thời = tốc độ của ống nhân với thời gian giữa các frame

    this.tempStartLocationDown = this.bottomPipe.position;
    this.tempStartLocationUp = this.topPipe.position;

    this.tempStartLocationDown.x -= this.tempSpeed; //di chuyển theo chiều ngang ống trên và ống dưới dựa theo tốc độ tính toán
    this.tempStartLocationUp.x -= this.tempSpeed;

    this.bottomPipe.setPosition(this.tempStartLocationDown); // áp dụng vị trí mới cho ống trên và ống dưới
    this.topPipe.setPosition(this.tempStartLocationUp);

    if (this.isPass == false && this.topPipe.position.x <= 0) { // kiểm tra xem isPass đã true chưa và vị trí của cái ống trên đã di chuyển qua điểm x = 0 chưa
      this.isPass = true; // set isPass = true
      this.game.passPipe(); // gọi passPipe()
    }

    if (this.topPipe.position.x < 0 - this.scene.width) { // kiểm tra xem cái ống đã đi ra ngoài cùng bên trái màn hình chưa
      this.game.createPipe(); // tạo thêm ống mới
      this.destroy(); // huỷ bỏ ống hiện tại
    }
  }
}
