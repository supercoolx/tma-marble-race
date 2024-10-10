import Matter, { Engine, Runner, Render, Composite, Composites, Common, Bodies, Body } from 'matter-js'
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Game () {
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

  const defaultWidth = 320;
  const defaultHeight = 529;
  let cw = window.innerWidth;
  let ratio = cw / defaultWidth;
  let ch = defaultHeight * ratio
  
  let render;
  let rank = [];

  useEffect(()=>{
    setTon(Number(state.ton || 1))
    setRoom(Number(state.room || 0))
    setMemberCountInRoom(Number(state.memberCountInRoom || 0))
    setMyIndex(state.myIndex)
    setUsers(state.users || [])
  },[state])

  useEffect(() => {
    if (users.length == 100){
      console.log(users)
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
    addHandles()
    drawWorld()
    addBallsToWorld()
    if (memberCountInRoom == 100)
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

  const drawWorld = () => {
    const wallOptions = {label: 'wall', isStatic: true, render:{fillStyle: '#72d5f4'}, collisionFilter: {mask: 0x001}}

    add([
      Bodies.rectangle(cw / 2, ch+40, cw, 82, wallOptions),
      Bodies.rectangle(-40, ch / 2, 81, ch, wallOptions),
      Bodies.rectangle(cw+40, ch / 2, 81, ch, wallOptions),
      Bodies.rectangle(cw / 2, -40, cw, 81, wallOptions),
      Bodies.rectangle(22.5*ratio,239.5*ratio,5*ratio,405*ratio, wallOptions),
      Bodies.rectangle(297.5*ratio,239.5*ratio,5*ratio,405*ratio, wallOptions),
      Bodies.rectangle(22.5*ratio,491.5*ratio,5*ratio,27*ratio, wallOptions),//37
      Bodies.rectangle(297.5*ratio,491.5*ratio,5*ratio,27*ratio, wallOptions),//37
      Bodies.rectangle(91.5*ratio, 521*ratio, 5*ratio,16*ratio, wallOptions),
      Bodies.rectangle(228.5*ratio, 521*ratio, 5*ratio,16*ratio, wallOptions),  
    ])

    const wall1 = Bodies.rectangle(66*ratio,418*ratio,5*ratio,154.8*ratio, wallOptions)
    Body.rotate(wall1, Math.PI / 4 - 0.17)
    const wall2 = Bodies.rectangle(254*ratio,418*ratio,5*ratio,154.8*ratio, wallOptions)
    Body.rotate(wall2, -Math.PI / 4 + 0.17)
    const wall3 = Bodies.rectangle(57*ratio, 521*ratio, 75.7*ratio,5*ratio, wallOptions)
    Body.rotate(wall3, -Math.PI / 12)
    const wall4 = Bodies.rectangle(263*ratio, 521*ratio, 75.7*ratio,5*ratio, wallOptions)
    Body.rotate(wall4, Math.PI / 12)
    const triangle1 = Bodies.polygon(160*ratio,350*ratio,3,10*ratio,wallOptions)
    Body.rotate(triangle1, Math.PI / 2)
    
    const ellipse3 = Bodies.fromVertices(80*ratio, 193*ratio, createEllipseVerticesArray(0.1+(ratio-1)/100,60*ratio), wallOptions, 5)
    Body.rotate(ellipse3, Math.PI / 4)
    const ellipse4 = Bodies.fromVertices(240*ratio, 193*ratio, createEllipseVerticesArray(0.1+(ratio-1)/100,60*ratio), wallOptions, 5)
    Body.rotate(ellipse4, -Math.PI / 4)
    add([wall1,wall2,wall3,wall4, ellipse3, ellipse4, triangle1])

    for (let i = 5; i <= 8; i++) {
      const yPosition = (382*ratio) + (i - 5) * 24 * ratio;
      add(createCircleStack(yPosition, i));
    }
    add(Bodies.rectangle(cw / 2, ch+40, 132*ratio, 82, {label: 'dead', isStatic: true, render:{fillStyle: '#ff0000'}, collisionFilter: {mask: 0x001}}))
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
    const stack = users.map((user, i) => {
      const render = user.id == myIndex ? {
        sprite: { texture: '/imgs/ball.png', xScale: 0.015625*ratio+cw/30000, yScale: 0.015625*ratio+cw/30000 }
      }:{
        sprite: { texture: '/imgs/ball_other.png', xScale: 0.015625*ratio+cw/30000, yScale: 0.015625*ratio+cw/30000 }
        // fillStyle: myIndex == i ? '#0000ff' : '#ffffff'
      }
      return Bodies.circle(
        user.position.x,
        user.position.y,
        5*ratio + cw / 30000,
        {
          label: "ball",
          index: i,
          userId:user.id,
          friction: 0.0001,
          density: 0.3,
          restitution: 0.8,
          render: render,
          collisionFilter: { mask: 0x001 }
        }
      )
    });
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
          if (rank.length == 100){
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

export default Game;
