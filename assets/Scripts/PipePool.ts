import { _decorator, Component, instantiate, Node, NodePool, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PipePool')
export class PipePool extends Component {
    @property({
        type: Prefab
    })
    public prefabPipes = null;

    @property({
        type: Node
    })
    public pipePoolHome;

    public pool = new NodePool; //tạo mới 1 pool để lưu trữ đối tượng 
    public createPipe

    initPool() {
        let initCount = 3 //khỏi tạo pool với số lượng ống ban đầu

        for(let i  = 0; i < initCount; i++) { //dùng vòng lặp để tạo initCount đối tượng ống
            this.createPipe = instantiate(this.prefabPipes);

            if(i == 0) { //nếu là lần đầu tạo thì thêm đối tượng ống vào node cha pipePoolHome
                this.pipePoolHome.addChild(this.createPipe);
            } else {
                this.pool.put(this.createPipe) // ngược lại đối tượng được đưa vào pool để tái sử dụng
            }
        }
    }

    addPool() { //được gọi khi cần thêm ống vào pool
        if (this.pool.size() > 0) { // nếu pool không rỗng thì lấy đối tượng từ pool
            this.createPipe = this.pool.get();
        } else { //nếu pool rỗng thì tạo một đối tượng ống bằng cách sử dụng instantiate
            this.createPipe = instantiate(this.prefabPipes) 
        }

        this.pipePoolHome.addChild(this.createPipe)// đối tượng được thêm vào node cha pipePoolHome
    }

    reset() {
        this.pipePoolHome.removeAllChildren();// xoá tất cả pool khỏi node cha
        this.pool.clear(); // xoá toàn bộ pool
        this.initPool(); // gọi lại initPool
    }
}

//đối với game có sự xuất hiện của các đối tượng giống nhau, dùng pool giúp tối ưu hoá hiệu suất bằng cách tái sử dụng
//lại các đối tượng thay vì tạo và huỷ chúng


