import {TypedPolymer, on, template, set} from "../src/typed-polymer";
import DomApi = polymer.DomApi;

@template(`
<h1>Hello World!</h1>
<div class="deep">
  <div class="selector">
    <button class="button" id="ok">OK</button>
    <input type="button" class="test1 test2" value="OK2">
    <input type="button" class="test3 test4" value="OK3">
  </div>
</div>`)
class TestComponentOn extends TypedPolymer {
  @set(false) initialized: boolean;

  ready(): void {
    this.initialized = true;
  }

  @on("test")
  basicEvent(): void {
    this.basicEvent["n"]++;
  }

  @on("ok.test")
  idEvent(): void {
    this.idEvent["n"]++;
  }

  @on("test", "h1")
  selector1(): void {
    this.selector1["n"]++;
  }

  @on("test", "button")
  selector2(): void {
    this.selector2["n"]++;
  }

  @on("test", ".button")
  selector3(): void {
    this.selector3["n"]++;
  }

  @on("test", ".deep > .selector")
  deepSelector(): void {
    this.deepSelector["n"]++;
  }

  @on("test", ".test1")
  selector4(): boolean {
    this.selector4["n"]++;
    return false;
  }

  @on("test", ".test2")
  selector5(): void {
    this.selector5["n"]++;
  }

  @on("test", ".test3")
  selector6(ev: Event): void {
    this.selector6["n"]++;
    ev.stopImmediatePropagation();
  }

  @on("test", ".test4")
  selector7(): void {
    this.selector7["n"]++;
  }
}

TestComponentOn.register();

const element: TestComponentOn = <any>document.createElement(TestComponentOn.moduleID);
const elementDom: DomApi = Polymer.dom(element["root"]);

function testSuite(target: string, ...methods: string[]): () => void {
  let [selector, eventName = "test"] = target.split(";");
  return () => {
    methods.forEach(method => element[method.split(":")[0]]["n"] = 0);
    let allNodes: Node[] = elementDom.querySelectorAll("*");
    allNodes.forEach(node => node.dispatchEvent(new CustomEvent(eventName, {bubbles: true})));
    methods.forEach(method => {
      let [methodName, expected = elementDom.querySelectorAll(selector).length + ""] = method.split(":");
      element[methodName]["n"].should.equal(parseInt(expected));
    });
  };
}
describe("Decorator@on", function () {
  /* tslint:disable:max-line-length */

  it("should run the `ready` method when component is ready", () => element.initialized.should.be.true);
  it("should fire basic event callback", testSuite("*", "basicEvent"));
  it("should fire an id specific event", testSuite("#ok", "idEvent"));
  it("should fire a selector based event", testSuite("h1", "selector1"));
  it("should fire a deep selector based event", testSuite(".deep > .selector", "deepSelector"));
  it("should fire all selector listeners matching same element", testSuite("button", "selector2", "selector3"));
  it("should NOT trigger further callbacks if false is returned", testSuite(".test1", "selector4", "selector5:0"));
  it("should NOT trigger further callbacks if `stopImmediatePropagation` is called", testSuite(".test3", "selector6", "selector7:0"));
});
