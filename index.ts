abstract class Button {
  constructor(public element: Element | null) {
    this.element = element;
  }
}

abstract class Input {
  constructor(public element: HTMLInputElement | null) {
    this.element = element;
  }
}

class SaveButton extends Button {
  constructor(element: Element | null, listenerFunction: () => void) {
    super(element);

    this.initiate(listenerFunction);
  }

  initiate(listenerFunction: () => void) {
    if (!!this.element) {
      this.element.addEventListener("click", (e) => {
        listenerFunction();
      });
    }
  }
}

class DeleteButton extends Button {
  constructor(element: Element | null, listenerFunction: () => void) {
    super(element);

    this.initiate(listenerFunction);
  }

  initiate(listenerFunction: () => void) {
    if (!!this.element) {
      this.element.addEventListener("click", (e) => {
        listenerFunction();
      });
    }
  }
}

class ColorPicker extends Input {
  public strokeStyle: string;
  constructor(element: HTMLInputElement, listenerFunction: () => void) {
    super(element);
    this.strokeStyle = "#000";

    this.initiate(listenerFunction);
  }

  initiate(listenerFunction: () => void) {
    if (!!this.element) {
      this.element.addEventListener("change", (e) => {
        const target = e.target as HTMLInputElement;
        this.strokeStyle = target.value;
        listenerFunction();
      });
    }
  }
}

class StrokeInput extends Input {
  public lineWidth: number;

  constructor(element: HTMLInputElement, listenerFunction: () => void) {
    super(element);
    this.lineWidth = 5;

    this.initiate(listenerFunction);
  }

  initiate(listenerFunction: () => void) {
    if (!!this.element) {
      this.element.addEventListener("change", (e) => {
        const target = e.target as HTMLInputElement;
        this.lineWidth = parseInt(target.value);
        listenerFunction();
      });
    }
  }
}

class Canvas {
  public element: HTMLCanvasElement;
  public context: CanvasRenderingContext2D | null;
  public points: Point[];
  public canDraw: boolean;
  public saveButton: SaveButton;
  public deleteButton: DeleteButton;
  public colorPicker: ColorPicker;
  public strokeInput: StrokeInput;

  constructor(
    element: HTMLCanvasElement,
    saveButton: Element,
    deleteButton: Element,
    colorPicker: HTMLInputElement,
    strokeInput: HTMLInputElement
  ) {
    this.element = element;
    this.context = this.element.getContext("2d");
    this.saveButton = new SaveButton(saveButton, this.saveImage);
    this.points = [];
    this.canDraw = false;
    this.deleteButton = new DeleteButton(deleteButton, this.clean);
    this.colorPicker = new ColorPicker(colorPicker, this.draw);
    this.strokeInput = new StrokeInput(strokeInput, this.draw);

    this.initiate();
  }

  initiate() {
    this.element.addEventListener("mousedown", ({ clientX, clientY }) => {
      this.canDraw = true;
      this.savePoint(clientX, clientY, false);
      this.draw();
    });

    this.element.addEventListener("mousemove", ({ clientX, clientY }) => {
      if (this.canDraw) {
        this.savePoint(clientX, clientY, true);
        this.draw();
      }
    });

    this.element.addEventListener("mouseup", (e) => {
      this.canDraw = false;
    });
    this.element.addEventListener("mouseleave", (e) => {
      this.canDraw = false;
    });
  }

  savePoint(x: number, y: number, dragging: boolean) {
    const area = this.element.getBoundingClientRect();
    const point = { x: x - area.left, y: y - area.top, dragging };
    this.points.push(point);
  }

  draw = () => {
    this.configContextForDrawing();

    if (!!this.context) {
      for (var i = 0; i < this.points.length; i++) {
        this.context.beginPath();
        const point = this.points[i];
        if (point.dragging && i > 0) {
          const previousPoint = this.points[i - 1];
          this.context.moveTo(previousPoint.x, previousPoint.y);
        } else {
          this.context.moveTo(point.x - 1, point.y);
        }
        this.context.lineTo(point.x, point.y);
        this.context.closePath();
        this.context.stroke();
      }
    }
  };

  configContextForDrawing = () => {
    if (!!this.context) {
      this.context.fillStyle = "white";
      this.context.fillRect(
        0,
        0,
        this.context.canvas.width,
        this.context.canvas.height
      );
      this.context.strokeStyle = this.colorPicker.strokeStyle;
      this.context.lineJoin = "round";
      this.context.lineWidth = this.strokeInput.lineWidth;
    }
  };

  saveImage = () => {
    const image = this.element.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = image;
    a.download = "canvas.png";
    a.click();
    document.body.append(a);
    document.body.removeChild(a);
  };

  clean = () => {
    if (!!this.context) {
      this.context.clearRect(
        0,
        0,
        this.context.canvas.width,
        this.context.canvas.height
      );
      this.context.fillStyle = "white";
      this.context.fillRect(
        0,
        0,
        this.context.canvas.width,
        this.context.canvas.height
      );
      this.points = [];
    }
  };
}

interface Point {
  x: number;
  y: number;
  dragging: boolean;
}

window.onload = (e: Event) => {
  const canvas = document.querySelector("canvas");
  const saveButton = document.querySelector(".save");
  const deleteButton = document.querySelector(".delete");
  const colorPicker = document.querySelector("#color");
  const strokeInput = document.querySelector("#stroke");

  if (!!canvas && !!saveButton) {
    new Canvas(canvas, saveButton, deleteButton, colorPicker, strokeInput);
  }
};
