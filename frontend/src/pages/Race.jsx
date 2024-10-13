import Matter, { Engine, Runner, Render, Composite, Composites, Common, Bodies, Body, Vertices, Svg } from 'matter-js'
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import 'pathseg/pathseg';

function Race () {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [ton, setTon] = useState()
  const [room, setRoom] = useState()
  const [memberCountInRoom, setMemberCountInRoom] = useState()
  const [myIndex, setMyIndex] = useState()
  const [users, setUsers] = useState([])
  const [winner, setWinner] = useState('')
  const scene = useRef()
  const engine = useRef(Engine.create())
  const world = useMemo(()=>engine.current.world,[engine])

  const defaultWidth = 367;
  const defaultHeight = 649.89;
  let cw = window.innerWidth;
  let ratio = cw / defaultWidth;
  let ch = defaultHeight * ratio
  
  let render;
  let rank = [];

  useEffect(()=>{
    setTon(Number(1))//setTon(Number(state.ton || 1))
    setRoom(Number(715))//setRoom(Number(state.room || 0))
    setMemberCountInRoom(5)//setMemberCountInRoom(Number(state.memberCountInRoom || 0))
    setMyIndex(2)//setMyIndex(state.myIndex)
    const userIds= ['763843','386343','873902','174942','374834']
    const colors = ['#ffd700', '#e43292','#ff6b00','#2cca36', '#ff0219']
    userIds.map((user, index) => {
      const x = 23.5 + 11*index + 15 * index
      const y = 21.5
      setUsers(prev => [...prev,{id:user, position:{x,y}, color:colors[index]}])
    })
  },[state])

  useEffect(() => {
    if (users.length == 5){
      renderSetup()
    
      return () => {
        Matter.Events.off(engine.current,'collisionStart')
        Matter.Events.off(engine.current, 'collisionActive');
        Render.stop(render)
        Composite.clear(world)
        Engine.clear(engine.current)
        render.canvas.remove()
        render.canvas = null
        render.context = null
        render.textures = {}
      }
    }
  },[users])

  const renderSetup = () => {
    render = Render.create({
      element: scene.current,
      engine: engine.current,
      options:{
        width: cw,
        height: ch,
        showAngleIndicator: false,
        showVelocity: false,
        showCollision: false,
        wireframes: false
      }
    })
    Render.run(render)
    var runner = Runner.create();
    Runner.run(runner,engine.current);
    Render.lookAt(render, {
      min: { x: 0, y: 0 },
      max: { x: cw, y: ch }
    });
    drawWorld()
    addBallsToWorld()
    if (memberCountInRoom == 5)
      engine.current.gravity.scale = 0.0004
    else
      engine.current.gravity.scale = 0
    handleCollisionEvent()
    var allBodies = Composite.allBodies(world);
    for (var i = 0; i < allBodies.length; i += 1) {
      allBodies[i].plugin.wrap = {
          min: { x: render.bounds.min.x, y: render.bounds.min.y },
          max: { x: render.bounds.max.x, y: render.bounds.max.y }
      };
    }
  }

  function createHalfCircle(x, y, radius, segments, rotate) {
    const points = [];
    console.log(rotate)
    for (let i = 0; i <= segments; i++) {
        const angle = Math.PI * (i / segments) + rotate; // Half-circle
        const px = x + radius * Math.cos(angle);
        const py = y - radius * Math.sin(angle); // Invert y-axis for canvas
        points.push({ x: px, y: py });
    }
    
    for (let i = 10; i < points.length - 11; i++) {
        const start = points[i];
        const end = points[i + 1];
        const line = Bodies.rectangle(
            (start.x + end.x) / 2,
            (start.y + end.y) / 2,
            Math.abs(end.x - start.x),
            1,
            { 
              isStatic: true,
              angle: Math.atan2(end.y - start.y, end.x - start.x),
              render: {fillStyle: '#8102FF'}
            }
        );
        add(line);
    }
  }

  const drawSVG = (x,y,svg,rotate=0,direction=0.01) => {
    var select = function(root, selector) {
      return Array.prototype.slice.call(root.querySelectorAll(selector));
    };

    var loadSvg = function(url) {
        return fetch(url)
            .then(function(response) { return response.text(); })
            .then(function(raw) { return (new window.DOMParser()).parseFromString(raw, 'image/svg+xml'); });
    };
    loadSvg(svg).then(function(root) {
      var vertexSets = select(root, 'path')
          .map(function(path) { 
            return Vertices.scale(Svg.pathToVertices(path, 30),0.1,-0.1)
          });
      const body = Bodies.fromVertices(x,y, vertexSets[0], {
        label: 'wall',
        isStatic: true,
        render: {
            fillStyle: '#8102FF',
            strokeStyle: '#8102FF',
            lineWidth: 1
        },
        collisionFilter: {mask: 0x001}
      }, true)
      Body.rotate(body,rotate)
      setInterval(()=> Body.rotate(body,direction),20)
      Composite.add(world, body);
    });
  }

  const drawWorld = () => {
    const wallOptions = {label: 'wall', isStatic: true,density: 0.8, restitution: 0.6, render:{fillStyle: '#8102FF'}, collisionFilter: {mask: 0x001}}
    const wallOptionsBlack = {label: 'wall', isStatic: true,density: 0.8, restitution: 0.6, render:{fillStyle: '#111'}, collisionFilter: {mask: 0x001}}
    
    const deg = Math.PI / 180
    const wall1 = Bodies.rectangle(74.5,88.5*ratio,137*ratio,3*ratio, wallOptions)
    Body.rotate(wall1, 8*deg)
    const wall2 = Bodies.rectangle(95.5*ratio,124.5*ratio,137*ratio,3*ratio, wallOptions)
    Body.rotate(wall2, -8*deg)
    const wall3 = Bodies.rectangle(37*ratio, 156.5*ratio, 66*ratio, 3*ratio, wallOptions)
    Body.rotate(wall3, 8*deg)
    const wall4 = Bodies.rectangle(124*ratio, 156.5*ratio, 76*ratio,3*ratio, wallOptions)
    Body.rotate(wall4, -8*deg)
    const wall5 = Bodies.rectangle(77*ratio, 416.5*ratio, 138*ratio,3*ratio, wallOptions)
    Body.rotate(wall5, 8*deg)
    const wall6 = Bodies.rectangle(98*ratio, 456.5*ratio, 134*ratio,3*ratio, wallOptions)
    Body.rotate(wall6, -8*deg)
    const wall7 = Bodies.rectangle(218.5*ratio, 80.5*ratio,37*ratio,3*ratio,wallOptions)
    Body.rotate(wall7, 15*deg)
    const wall8 = Bodies.rectangle(343*ratio, 80.5*ratio,38*ratio,3*ratio,wallOptions)
    Body.rotate(wall8, -13*deg)
    const wall9 = Bodies.rectangle(296*ratio, 325.5*ratio,144*ratio,3*ratio,wallOptions)
    Body.rotate(wall9,-13*deg)
    const wall10 = Bodies.rectangle(276*ratio, 373.5*ratio,144*ratio,3*ratio,wallOptions)
    Body.rotate(wall10,15*deg)
    const wall11 = Bodies.rectangle(302.5*ratio, 419.5*ratio,115*ratio,3*ratio,wallOptions)
    Body.rotate(wall11,-13*deg)
    const wall12 = Bodies.rectangle(229.5*ratio, 485.5*ratio,57*ratio,3*ratio,wallOptions)
    Body.rotate(wall12,25*deg)
    const wall13 = Bodies.rectangle(327*ratio, 481.5*ratio,72*ratio,3*ratio,wallOptions)
    Body.rotate(wall13,-23*deg)
    drawSVG(79*ratio,223*ratio,"/imgs/star.svg",30*deg)
    drawSVG(79*ratio,334*ratio,"/imgs/star.svg",60*deg)
    drawSVG(75*ratio,509*ratio,"/imgs/cross.svg",0,-0.01)
    drawSVG(240*ratio,119*ratio,"/imgs/star1.svg",20*deg)
    drawSVG(314*ratio,119*ratio,"/imgs/star1.svg",60*deg)
    drawSVG(240*ratio,188*ratio,"/imgs/star1.svg",80*deg)
    drawSVG(314*ratio,188*ratio,"/imgs/star1.svg",30*deg)
    drawSVG(240*ratio,258*ratio,"/imgs/star1.svg",10*deg)
    drawSVG(314*ratio,258*ratio,"/imgs/star1.svg")
    drawSVG(305.5*ratio,362*ratio,"/imgs/cross.svg",0,-0.01)
    drawSVG(278*ratio,497*ratio,"/imgs/cross.svg")
    createHalfCircle(79*ratio, 223*ratio, 54*ratio, 100, 90*deg);
    createHalfCircle(79*ratio, 223*ratio, 54*ratio, 100,270*deg);
    createHalfCircle(78*ratio, 334*ratio, 55*ratio, 100, 90*deg);
    createHalfCircle(78*ratio, 334*ratio, 55*ratio, 100,270*deg);
    createHalfCircle(240.5*ratio, 119.5*ratio, 36*ratio, 100, 90*deg);
    createHalfCircle(240.5*ratio, 119.5*ratio, 36*ratio, 100,270*deg);
    createHalfCircle(314.5*ratio, 119.5*ratio, 36*ratio, 100, 90*deg);
    createHalfCircle(314.5*ratio, 119.5*ratio, 36*ratio, 100,270*deg);
    createHalfCircle(240.5*ratio, 188.5*ratio, 36*ratio, 100, 90*deg);
    createHalfCircle(240.5*ratio, 188.5*ratio, 36*ratio, 100,270*deg);
    createHalfCircle(314.5*ratio, 188.5*ratio, 36*ratio, 100, 90*deg);
    createHalfCircle(314.5*ratio, 188.5*ratio, 36*ratio, 100,270*deg);
    createHalfCircle(240.5*ratio, 258.5*ratio, 36*ratio, 100, 90*deg);
    createHalfCircle(240.5*ratio, 258.5*ratio, 36*ratio, 100,270*deg);
    createHalfCircle(314.5*ratio, 258.5*ratio, 36*ratio, 100, 90*deg);
    createHalfCircle(314.5*ratio, 258.5*ratio, 36*ratio, 100,270*deg);
    add([wall1,wall2,wall3,wall4,wall5,wall6,wall7,wall8,wall9,wall10,wall11,wall12,wall13])
    var triangleVertices = [
      { x: 10*ratio, y: 509*ratio }, // Top point
      { x: 10 * ratio, y: 548*ratio }, // Left point
      { x: 166 * ratio, y: 548 * ratio }  // Right point
    ];
    add(Bodies.fromVertices(59*ratio,538*ratio,triangleVertices,{
      isStatic:true,
      render: {
          fillStyle: '#111',
          strokeStyle: '#111',
          lineWidth: 2
      }
    }))

    var triangleVertices1 = [
      { x: 275*ratio, y: 76*ratio }, // Top point
      { x: 255 * ratio, y: 85*ratio }, // Left point
      { x:  295 * ratio, y: 85 * ratio }  // Right point
    ];
    add(Bodies.fromVertices(275*ratio,80.5*ratio,triangleVertices1,{
      isStatic:true,
      render: {
          fillStyle: '#8102FF',
          strokeStyle: '#8102FF',
          lineWidth: 2
      }
    }))
    var triangleVertices1 = [
      { x: 180*ratio, y: 0*ratio }, // Top point
      { x: 212 * ratio, y: 0*ratio }, // Left point
      { x:  180 * ratio, y: 3 * ratio }  // Right point
    ];
    add(Bodies.fromVertices(180*ratio,1.5*ratio,triangleVertices1,{
      isStatic:true,
      render: {
          fillStyle: '#111',
          strokeStyle: '#111',
          lineWidth: 2
      }
    }))
    const elevator = Bodies.rectangle(184*ratio,ch-20*ratio,28*ratio,40*ratio,wallOptions)
    const door = Bodies.rectangle(165*ratio,ch-40*ratio,10*ratio,80*ratio,wallOptionsBlack)
    setInterval(() => {
        const { y } = elevator.position;
        if (y < 30) {
          Body.setPosition(elevator, { x: elevator.position.x, y: ch+10 });
          Body.setPosition(door, { x: door.position.x, y: ch-10})
        }
        Body.translate(elevator, { x: 0, y: -4 }, true);
        Body.translate(door, {x:0,y:-4},true)
    }, 20);
    add([elevator,door])
    add([
      Bodies.rectangle(cw / 2*ratio, ch+40*ratio, cw*ratio, 81*ratio, wallOptionsBlack),
      Bodies.rectangle(-35*ratio, ch / 2*ratio, 90*ratio, ch*ratio, wallOptionsBlack),
      Bodies.rectangle(cw+35*ratio, ch / 2*ratio, 90*ratio, ch*ratio, wallOptionsBlack),
      Bodies.rectangle(cw / 2*ratio, -40*ratio, cw*ratio, 81*ratio, wallOptionsBlack),
      Bodies.rectangle(87*ratio, 43*ratio, 152*ratio, 6*ratio, {label: 'start', isStatic: true,density: 0.8, restitution: 0.6, render:{fillStyle: '#fff'}, collisionFilter: {mask: 0x002}}),
      Bodies.rectangle(165*ratio,256*ratio,10*ratio,512*ratio,wallOptionsBlack),
      Bodies.rectangle(165*ratio,256*ratio,10*ratio,512*ratio,wallOptionsBlack),
      Bodies.rectangle(85*ratio,603*ratio,170*ratio,100*ratio,wallOptionsBlack),
      Bodies.rectangle(202*ratio,348*ratio,10*ratio,600*ratio,wallOptionsBlack),
      Bodies.rectangle(283*ratio, 556*ratio, 146*ratio, 32*ratio, {label: 'dead', isStatic: true,density: 0.8, restitution: 0.6, render:{fillStyle: '#fff'}, collisionFilter: {mask: 0x001}}),
    ])
  };

  const add = (body) => {
    Composite.add(world, body)
  }

  const createCircleStack = (y, count) => {
    return Composites.stack((cw - (12 * count + 11 * (count - 1)) * ratio) / 2, y, count, 1, 11 * ratio, 0, (x, y) =>
      Bodies.circle(x, y, 6 * ratio, { friction: 0.001, restitution: 0.5,  isStatic: true, label: 'wall', render: { fillStyle: '#B45AD3' }, collisionFilter: { mask: 0x001 } })
    );
  };

  const createEllipseVerticesArray = (ellipseFlatness,ellipseSize) => {
    let ellipseVerticesArray = [];

    let ellipseVertices = 50;

    for (let i = 0; i < ellipseVertices; i++) {
        let x = ellipseSize * Math.cos(i);
        let y = ellipseFlatness * ellipseSize * Math.sin(i);
        ellipseVerticesArray.push({ x: x, y: y });
    }
    return ellipseVerticesArray
  }

  const addBallsToWorld = () => {
    const stack = users.map((user, i) => 
      Bodies.circle(
        user.position.x*ratio,
        user.position.y*ratio,
        5.5*ratio,
        {
          label: "ball",
          index: i,
          userId:user.id,
          friction: 0.0001,
          density: 0.3,
          restitution: 0.8,
          isStatic:false,
          render: {fillStyle: user.color},
          collisionFilter: { mask: 0x001 }
        }
      )
    );
    add(stack);
  };

  const movingHandle = (handle,angleLimitPositive,angleLimitNegative) => {
    let angle = 0;
    let direction = 1;
    let speed=0.015;
    setInterval(() => {
      if (angle > angleLimitPositive) direction = -1;
      else if (angle < angleLimitNegative) direction = 1;
      
      angle += direction * speed;
      Body.rotate(handle, direction * speed);
    }, 20);
  }

  const rotateHandle = (handle) => {
    let speed=0.015;
    setInterval(() => {
      Body.rotate(handle, speed);
    }, 20);
  }

  const addHandles = () => {
    const wallOptions = {label: 'wall', isStatic: true, render:{fillStyle: '#045aff'}, collisionFilter: {mask: 0x001}}

    const rect = Bodies.rectangle(160*ratio,145*ratio,170*ratio,8*ratio, wallOptions)
    add(rect)
    movingHandle(rect, Math.PI / 6, -Math.PI / 6)
    const rectangles = [];
    for (let i = 0; i < 4; i++) {
      const rect = Bodies.rectangle(160 * ratio, 232 * ratio, 60 * ratio, 5 * ratio, wallOptions);
      Body.rotate(rect, (Math.PI / 4) * i);
      rectangles.push(rect);
      rotateHandle(rect)
    }
    add(rectangles)

    let ellipse1 = Bodies.fromVertices(119*ratio, 313*ratio, createEllipseVerticesArray(0.1+(ratio-1)/100,40*ratio), wallOptions, 5);
    let ellipse2 = Bodies.fromVertices(201*ratio, 313*ratio, createEllipseVerticesArray(0.1+(ratio-1)/100,40*ratio), wallOptions, 5);
    add([ellipse1, ellipse2]);
    rotateHandle(ellipse1)
    Body.rotate(ellipse2, Math.PI / 4 * 3)
    rotateHandle(ellipse2)

    const positions = [
      { x: 10 * ratio, y: [460.5, 340.5, 220.5, 100.5] },
      { x: 310 * ratio, y: [460.5, 340.5, 220.5, 100.5] },
    ];
    
    const bodies = positions.flatMap(({ x, y }) =>
      y.map((yPos) => Bodies.rectangle(x, yPos * ratio, 20 * ratio, 5 * ratio, wallOptions))
    );
    
    add(bodies);
    
    bodies.forEach((body, index) => {
      const direction = index / 4 < 1 ? Math.PI / 60 : -Math.PI / 60;
      Body.rotate(body, direction);
    });
    
    setInterval(() => {
      bodies.forEach((body) => {
        const { y } = body.position;
        if (y < 30) {
          Body.setPosition(body, { x: body.position.x, y: ch+10 });
        }
        Body.translate(body, { x: 0, y: -4 }, true);
      });
    }, 20);

    const triangle2 = Bodies.polygon(160*ratio,137*ratio,3,10*ratio,wallOptions)
    Body.rotate(triangle2, Math.PI / 2)
    add(triangle2)

    add([
      Bodies.circle(119*ratio,313*ratio,8*ratio,wallOptions),
      Bodies.circle(201*ratio,313*ratio,8*ratio,wallOptions),    
    ])
  };

  const handleCollisionEvent = () => {
    Matter.Events.off(engine.current, 'collisionStart');
    Matter.Events.on(engine.current, 'collisionStart', function (event) {
      event.pairs.forEach(function (pair) {
        const ball = pair.bodyA.label === 'ball' ? pair.bodyA : pair.bodyB.label === 'ball' ? pair.bodyB : null;
        const dead = pair.bodyA.label === 'dead' ? pair.bodyA : pair.bodyB.label === 'dead' ? pair.bodyB : null;

        if (ball && dead) {
          Composite.remove(world, ball);
          rank.push(ball.index)
          if (rank.length == 5){
            setWinner(ball.userId)
          }
          // if (ball.index == myIndex){
          //   setMyRank(100-rank.length + 1)
          // }
        }
      });
    });
    Matter.Events.off(engine.current, 'collisionActive');
    Matter.Events.on(engine.current, 'collisionActive', function (event) {
      event.pairs.forEach(function (pair) {
        const ball = pair.bodyA.label === 'ball' ? pair.bodyA : pair.bodyB.label === 'ball' ? pair.bodyB : null;
        const wall = pair.bodyA.label === 'wall' ? pair.bodyA : pair.bodyB.label === 'wall' ? pair.bodyB : null;
        const alive = pair.bodyA.label === 'alive' ? pair.bodyA : pair.bodyB.label === 'alive' ? pair.bodyB : null;
        if (ball && wall) {
          const velocity = ball.velocity;
          if (velocity.x > 3)
            Body.setVelocity(ball,{x:3, y: velocity.y})
          if (velocity.y < 0.001){
            Body.setPosition(ball,{x:ball.position.x-1, y:ball.position.y})
          }
        }
        if (ball && alive){
          Body.setPosition(ball,{x:Common.random((cw / 2 - 50), (cw / 2 + 50)),y:Common.random(60*ratio, 80*ratio)})
        }
      })
    })
  }

  const handleMenuButton = (e) => {
    e.preventDefault()
    navigate('/')
  }
  
  return (
    <div>
      <div ref={scene} style={{width: '100%'}}/>
      <div>
        <div style={{position: 'absolute', top: '10px', left: '12px', color: 'white', display: 'flex', gap: '1em'}}>
          <h5 style={{margin:'6px 0px'}}>Room: {room}</h5>
          <h5 style={{margin:'6px 0px'}}>Ton: {ton}</h5>
          <h5 style={{margin:'6px 0px'}}>Members: {memberCountInRoom}</h5>
        </div>
        <div  className='text-[#BF4F74] text-lg m-1 py-1 px-4 border-[2px] border-solid border-[#BF4F74] rounded-sm bg-[#333] cursor-pointer' onClick={handleMenuButton} style={{position: 'absolute', top: '10px', right: '12px'}}>Menu</div>
        {winner != '' && (
          <div style={{position: 'absolute', top: ch / 2 - 88, color: 'white', width: '100%'}}>
            <h1 style={{textAlign:'center', fontSize: '2.5rem'}}>Finished</h1>
            <h2 style={{textAlign:'center', fontSize: '2rem'}}>The winner is {winner}</h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default Race;
