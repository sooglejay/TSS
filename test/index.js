/**
 * Created by Johnny on 17/12/14.
 */
/**
 * 1、Binarytree 是一个类，（类型是Object）
 * 2、js 里面的任何东西（包括），都是类
 * 3、这是标准的类定义形式
 */
var node = function (key) {
    // 这里的this，指代的是node 这个类，
    this.key = key;
    // 所以key/left/right都是node这个类的属性
    this.left = null;
    this.right = null;
};

var Binarytree = function () {
    this.root = null;


    this.insertNode = function (node, newNode) {
        if (newNode.key < node.key) {
            if (node.left === null) {
                node.left = newNode;
            } else {
                this.insertNode(node.left, newNode);
            }
        } else {
            if (node.right === null) {
                node.right = newNode;
            } else {
                this.insertNode(node.right, newNode);
            }
        }
    };

    // insertKey 是 类Binarytree的一个方法，
    this.insertKey = function (key) {
        var newnode = new node(key);
        if (this.root === null) {
            this.root = newnode;
        } else {
            // 使用的是Binarytree的成员方法,不可以加this，因为this，指代的是insertKey这个类了
            // 错误的写法 this.insertNode(root, newnode);
            this.insertNode(this.root, newnode);
        }
    };
};

function test() {
    var nodes = [8, 2, 3, 7, 19, 2, 34, 12];
    var binarytree = new Binarytree();
    nodes.forEach(function (key) {
        binarytree.insertKey(key);
    });
    displayBinaryTree(binarytree);
}
function displayBinaryTree(nodes) {
    if (tree != undefined) {
        console.log(tree.nodes.key);
        displayBinaryTree(tree.left);
        displayBinaryTree(tree.right);
    }
}
