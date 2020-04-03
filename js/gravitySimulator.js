
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");


function toRadians(angle){
  return Math.PI * angle / 180;
}



class Canyon {

  constructor(positionX=11, positionY=11, angle=45, length=50, width=10){
    this.bull = null;
    this.angle = angle;
    this.length = length;
    this.width = width;
    this.positionX = positionX;
    this.positionY = positionY;
  }

  _shootPoint(){
    return {x: this.positionX + this.length*Math.cos(toRadians(this.angle)),
      y: this.positionY + this.length*Math.sin(toRadians(this.angle))}
    }


    shoot(v0) {
      this.bull = new Bull();
      let x0_y0 = this._shootPoint();
      console.log(x0_y0)
      this.bull.x = x0_y0.x;
      this.bull.y = x0_y0.y;
      this.bull.throwWithAngle(v0,this.angle)
    }

  }

  class Bull {

    constructor(){
      this.gravity = 10;
      this.wind= 0;

      this.x = 0;
      this.y = 0;
      this.vx = 0;
      this.vy = 0;
      this.ax=this.wind;
      this.ay=-this.gravity;
      this.m=1;
    }

    nextPosition(deltaT){
      this.x = this.x + deltaT * this.vx + 0.5*this.ax*deltaT**2;
      this.y = this.y + deltaT * this.vy + 0.5*this.ay*deltaT**2;
      this.vx = this.vx + this.ax * deltaT;
      this.vy = this.vy + this.ay * deltaT;
    }

    throwWithAngle(v0, angle){
      this.vx = v0/this.m * Math.cos(toRadians(angle));
      this.vy = v0/this.m * Math.sin(toRadians(angle));
    }


  }

  class Model {
    constructor(){
      this.canyon=new Canyon();
    }

  }


  class Controller{

    constructor(){
      this.deltaT = 0.1
      self = this;
      this.model= new Model();
      this.model.canyon.shoot(50);
      this.view = new View();
      this.view.drawCanyon(this.model.canyon.positionX,
        this.model.canyon.positionY,
        this.model.canyon.length,
        this.model.canyon.width,
        this.model.canyon.angle);
        this.interval = null;
      }

      checkKey(e) {

        e = e || window.event;

        if (e.keyCode == '38') {//Arriba
          let x_y = self.model.canyon._shootPoint()
          self.view.cleanRect(0,0,x_y.x+5,x_y.y+5)

          self.model.canyon.angle++;
          self.view.drawCanyon(
            self.model.canyon.positionX,
            self.model.canyon.positionY,
            self.model.canyon.length,
            self.model.canyon.width,
            self.model.canyon.angle);
          }
          else if (e.keyCode == '40') {
            let x_y = self.model.canyon._shootPoint()
            self.view.cleanRect(0,0,x_y.x+5,x_y.y+5)
            self.model.canyon.angle--;
            self.view.drawCanyon(
              self.model.canyon.positionX,
              self.model.canyon.positionY,
              self.model.canyon.length,
              self.model.canyon.width,
              self.model.canyon.angle);
            // down arrow
          }
          else if (e.keyCode == '37') {

          }
          else if (e.keyCode == '39') {
            console.log("right")
            self.model.canyon.shoot(50);

            self.pause();
            self.start();
          }

        }

        move(){
          self.model.canyon.bull.nextPosition(self.deltaT);
          self.view.removeAndDraw(self.model.canyon.bull.x, self.model.canyon.bull.y);
        }

        start(){
          this.interval= setInterval(this.move, this.deltaT*1000);
        }

        pause(){
          if (this.interval!=null)
            this.interval.clear();
        }


      }



      class View {


        constructor(){
          this.c = document.getElementById("myCanvas");
          this.ctx = c.getContext("2d");
          ctx.transform(1, 0, 0, -1, 0, c.height)
          this.lastX = null;
          this.lastY = null;
        }

        remove(x,y){
          this.ctx.beginPath();
          this.ctx.arc(x, y, 2, 0, 2 * Math.PI);
          this.ctx.fillStyle = "white";
          this.ctx.fill();
        }

        draw(x,y){
          this.ctx.beginPath();
          this.ctx.arc(x, y, 2, 0, 2 * Math.PI);
          this.ctx.fillStyle = "black";
          this.ctx.fill();
          this.lastX = x;
          this.lastY = y;
        }

        removeAndDraw(x,y){
          this.remove(this.lastX, this.lastY);
          this.draw(x,y);
        }

        lineToAngle(x1, y1, length, width, angle) {

          angle *= Math.PI / 180;

          var x2 = x1 + length * Math.cos(angle),
          y2 = y1 + length * Math.sin(angle);

          this.ctx.moveTo(x1, y1);
          this.ctx.lineTo(x2, y2);

          this.ctx.lineWidth = width;
          this.ctx.stroke();

          return {x: x2, y: y2};
        }

        rectangle(x,y,length,width,angle){
          this.ctx.beginPath();
          this.lineToAngle(x, y, length, width, angle);
        }

        drawCanyon(x, y, length, width, angle){

          this.ctx.beginPath();
          this.ctx.lineWidth = 1;
          this.ctx.arc(x,y, y-1, 0, toRadians(360));
          this.ctx.stroke();
          this.rectangle(x,y,length,width,angle);

        }

        cleanRect(x0,y0,x1,y1){

          this.ctx.clearRect(x0,y0,x1,y1);

        }


      }

      //setInterval(draw, 1000);
      var controller = new Controller();

      document.addEventListener('keydown', controller.checkKey);
