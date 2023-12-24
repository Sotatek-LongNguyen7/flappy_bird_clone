import {
  _decorator,
  Canvas,
  Component,
  director,
  Node,
  UITransform,
  Vec3,
} from "cc";
const { ccclass, property } = _decorator;

import { GameCtrl } from "./GameCtrl";

@ccclass("Ground")
export class Ground extends Component {
  // Đánh dấu các biến là các thuộc tính của component, giúp chúng có thể được hiển thị và chỉnh sửa trong trình soạn thảo của Cocos Creator.
  @property({
    type: Node,
    tooltip: "Ground 1 is here",
  })
  public ground1: Node;

  @property({
    type: Node,
    tooltip: "Ground 2 is here",
  })
  public ground2: Node;

  @property({
    type: Node,
    tooltip: "Ground 3 is here",
  })
  public ground3: Node;

  //Create ground width variables
  public groundWidth1: number; //  Là chiều rộng của các đối tượng ground.
  public groundWidth2: number; //  Là chiều rộng của các đối tượng ground.
  public groundWidth3: number; //  Là chiều rộng của các đối tượng ground.

  public tempStartLocation1 = new Vec3(); //  Là vị trí khởi đầu của các đối tượng ground.
  public tempStartLocation2 = new Vec3(); //  Là vị trí khởi đầu của các đối tượng ground.
  public tempStartLocation3 = new Vec3(); //  Là vị trí khởi đầu của các đối tượng ground.

  public gameCtrlSpeed = new GameCtrl();
  public gameSpeed: number; //  Là tốc độ di chuyển của các đối tượng ground.

  onLoad() {
    this.startUp(); // Gọi hàm startUp khi component được tải.
  }

  // Hàm này thực hiện việc lấy thông tin về chiều rộng của các đối tượng ground và thiết lập vị trí khởi đầu của chúng. Init value
  startUp() {
    // Sử dụng getComponent(UITransform) để lấy thông tin về thành phần UITransform của mỗi đối tượng ground.
    this.groundWidth1 = this.ground1.getComponent(UITransform).width; // Chiều rộng của ground1 được lấy và gán cho biến groundWidth1.
    this.groundWidth2 = this.ground2.getComponent(UITransform).width;
    this.groundWidth3 = this.ground3.getComponent(UITransform).width;

    // Thiết lập vị trí khởi đầu của các đối tượng ground:
    this.tempStartLocation1.x = 0; // Gán giá trị 0 cho tempStartLocation1.x để đặt ground1 ở vị trí bắt đầu của màn hình.
    this.tempStartLocation2.x = this.groundWidth1; // tempStartLocation2.x được thiết lập bằng groundWidth1, đặt ground2 ngay sau ground1.
    this.tempStartLocation3.x = this.groundWidth1 + this.groundWidth2; // tempStartLocation3.x được thiết lập bằng groundWidth1 + groundWidth2, đặt ground3 ngay sau ground2.

    // Gọi phương thức setPosition để đặt vị trí của các đối tượng ground1, ground2, và ground3 dựa trên các giá trị đã được thiết lập ở bước trước.
    this.ground1.setPosition(this.tempStartLocation1);
    this.ground2.setPosition(this.tempStartLocation2);
    this.ground3.setPosition(this.tempStartLocation3);
  }

  update(deltaTime: number) {
    this.gameSpeed = this.gameCtrlSpeed.speed; //gán tốc độ game cho gameSpeed

    this.tempStartLocation1 = this.ground1.position; //gán vị trí của các ground cho tempStartLocation
    this.tempStartLocation2 = this.ground2.position; //gán vị trí của các ground cho tempStartLocation
    this.tempStartLocation3 = this.ground3.position; //gán vị trí của các ground cho tempStartLocation

    this.tempStartLocation1.x -= this.gameSpeed * deltaTime; //giảm giá trị x của các tempStartLocation tương ứng với sự di chuyển của đối tượng trong khoảng thời gian giữa các frame
    this.tempStartLocation2.x -= this.gameSpeed * deltaTime; // tạo hiệu ứng là ground đang di chuyển sang trái
    this.tempStartLocation3.x -= this.gameSpeed * deltaTime;

    const scene = director.getScene();
    const canvas = scene.getComponentInChildren(Canvas);

    if (this.tempStartLocation1.x <= 0 - this.groundWidth1) {
      this.tempStartLocation1.x = canvas.getComponent(UITransform).width;
    }

    if (this.tempStartLocation2.x <= 0 - this.groundWidth2) {
      this.tempStartLocation2.x = canvas.getComponent(UITransform).width;
    }

    if (this.tempStartLocation3.x <= 0 - this.groundWidth3) {
      this.tempStartLocation3.x = canvas.getComponent(UITransform).width;
    }

    this.ground1.setPosition(this.tempStartLocation1);
    this.ground2.setPosition(this.tempStartLocation2);
    this.ground3.setPosition(this.tempStartLocation3);
  }
}
