
document.addEventListener('DOMContentLoaded', function(event) {

  var c = document.getElementById('the-circle');
  var d = document.getElementById('the-other-circle');

  draggable(c);
  draggable(d);


  function draggable(circle) {

    circle.onmousedown = startDrag;

    var deltaX = 0, deltaY = 0, posX = 0, posY = 0;

    function startDrag(e) {
      console.log('start');
      e = e || window.event;
      e.preventDefault();
      posX = e.clientX;
      posY = e.clientY;
      document.onmousemove = move;
      document.onmouseup = stopDrag;
    }

    function move(e) {
      //console.log('x: ' + posX + ' & y: ' + posY);
      //console.log('move');
      e = e || window.event;
      e.preventDefault();
      //deltaX = posX - e.clientX;
      deltaY = posY - e.clientY;

      //posX = e.clientX;
      posY = e.clientY;

      console.log(circle.height);
      //circle.style.left = (circle.offsetLeft - deltaX) + "px";
      circle.style.height = (circle.clientHeight - deltaY) + "px";

    }

    function stopDrag(e) {
      document.onmousemove = null;
      document.onmouseup = null;
    }


  }


})

