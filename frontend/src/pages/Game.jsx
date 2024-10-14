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
  const [myCount, setMyCount] = useState()
  const [users, setUsers] = useState([])
  const [winner, setWinner] = useState('')
  const scene = useRef()
  const engine = useRef(Engine.create())
  const world = useMemo(()=>engine.current.world,[engine])

  const defaultWidth = 363;
  const defaultHeight = 614;
  let cw = window.innerWidth;
  let ratio = cw / defaultWidth;
  let ch = defaultHeight * ratio
  
  let render;
  let rank = [];
  let temp = 0;

  useEffect(()=>{
    setTon(Number(state.ton || 1))
    setRoom(Number(state.room || 0))
    setMemberCountInRoom(Number(state.memberCountInRoom || 0))
    setMyIndex(state.myIndex)
    setMyCount(state.myCount)
    setUsers(state.users || [])
    temp=0
  },[state])

  useEffect(() => {
    if (users.length == 100){
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
    const wallOptions = {label: 'wall', isStatic: true, render:{fillStyle: '#045AFF'}, collisionFilter: {mask: 0x001}}

    add([
      Bodies.rectangle(cw / 2, ch+40, cw, 82, wallOptions),
      Bodies.rectangle(-40, ch / 2, 81, ch, wallOptions),
      Bodies.rectangle(cw+40, ch / 2, 81, ch, wallOptions),
      Bodies.rectangle(cw / 2, -40, cw, 81, wallOptions),
      Bodies.rectangle(28.5*ratio,308.5*ratio,3*ratio,503*ratio, wallOptions),
      Bodies.rectangle(335.5*ratio,304.5*ratio,3*ratio,497*ratio, wallOptions),
      Bodies.rectangle(130.5*ratio,592.5*ratio,3*ratio,47*ratio, wallOptions),
      Bodies.rectangle(232.5*ratio,592.5*ratio,3*ratio,47*ratio, wallOptions),
    ])

    const deg = Math.PI / 180

    const wall1 = Bodies.rectangle(93*ratio,71.5*ratio,134*ratio,3*ratio, wallOptions)
    Body.rotate(wall1, 10*deg)
    const wall2 = Bodies.rectangle(268*ratio,72.5*ratio,130*ratio,3*ratio, wallOptions)
    Body.rotate(wall2, -10*deg)
    const wall3 = Bodies.rectangle(114*ratio, 117.5*ratio, 130*ratio,3*ratio, wallOptions)
    Body.rotate(wall3, -10*deg)
    const wall4 = Bodies.rectangle(250*ratio, 117.5*ratio, 134*ratio,3*ratio, wallOptions)
    Body.rotate(wall4, 10*deg)
    const wall5 = Bodies.rectangle(94*ratio, 155.5*ratio, 134*ratio,3*ratio, wallOptions)
    Body.rotate(wall5, 10*deg)
    const wall6 = Bodies.rectangle(267*ratio, 155.5*ratio, 130*ratio,3*ratio, wallOptions)
    Body.rotate(wall6, -10*deg)
    const wall7 = Bodies.rectangle(150.5*ratio, 308*ratio, 3*ratio,62*ratio, wallOptions)
    Body.rotate(wall7, -17*deg)
    const wall8 = Bodies.rectangle(212.5*ratio, 308*ratio, 3*ratio,62*ratio, wallOptions)
    Body.rotate(wall8, 16*deg)
    const wall9 = Bodies.rectangle(116*ratio, 360.5*ratio, 98*ratio,3*ratio, wallOptions)
    Body.rotate(wall9, 21*deg)
    const wall14 = Bodies.rectangle(247.5*ratio, 353.5*ratio, 97*ratio,3*ratio, wallOptions)
    Body.rotate(wall14, -29*deg)
    const wall10 = Bodies.rectangle(112.5*ratio, 459.5*ratio, 3*ratio,189*ratio, wallOptions)
    Body.rotate(wall10, 32*deg)
    const wall11 = Bodies.rectangle(249.5*ratio, 460.5*ratio, 3*ratio,191*ratio, wallOptions)
    Body.rotate(wall11, -31*deg)
    const wall12 = Bodies.rectangle(67*ratio, 582.5*ratio, 134*ratio,3*ratio, wallOptions)
    Body.rotate(wall12, -10*deg)
    const wall13 = Bodies.rectangle(312.5*ratio, 585.5*ratio, 159*ratio,3*ratio, wallOptions)
    Body.rotate(wall13, 10*deg)

    
    
    // const ellipse3 = Bodies.fromVertices(80*ratio, 193*ratio, createEllipseVerticesArray(0.1+(ratio-1)/100,60*ratio), wallOptions, 5)
    // Body.rotate(ellipse3, Math.PI / 4)
    // const ellipse4 = Bodies.fromVertices(240*ratio, 193*ratio, createEllipseVerticesArray(0.1+(ratio-1)/100,60*ratio), wallOptions, 5)
    // Body.rotate(ellipse4, -Math.PI / 4)
    add([wall1,wall2,wall3,wall4,wall5,wall6,wall7,wall8,wall9,wall10,wall11,wall12,wall13,wall14])

    // for (let i = 2; i <= 5; i++) {
    //   const yPosition = (416*ratio) + (i - 2) * 26 * ratio;
    //   add(createCircleStack(yPosition, i));
    // }
    add([
      Bodies.circle(165.5*ratio,424.5*ratio,8.5*ratio,wallOptions),
      Bodies.circle(199.5*ratio,424.5*ratio,8.5*ratio,wallOptions),

      Bodies.circle(148.5*ratio,450.5*ratio,8.5*ratio,wallOptions),
      Bodies.circle(182.5*ratio,450.5*ratio,8.5*ratio,wallOptions),
      Bodies.circle(216.5*ratio,450.5*ratio,8.5*ratio,wallOptions),
      
      Bodies.circle(131.5*ratio,477.5*ratio,8.5*ratio,wallOptions),
      Bodies.circle(165.5*ratio,477.5*ratio,8.5*ratio,wallOptions),
      Bodies.circle(199.5*ratio,477.5*ratio,8.5*ratio,wallOptions),
      Bodies.circle(233.5*ratio,477.5*ratio,8.5*ratio,wallOptions),

      Bodies.circle(114.5*ratio,503.5*ratio,8.5*ratio,wallOptions),
      Bodies.circle(147.5*ratio,503.5*ratio,8.5*ratio,wallOptions),
      Bodies.circle(181.5*ratio,503.5*ratio,8.5*ratio,wallOptions),
      Bodies.circle(215.5*ratio,503.5*ratio,8.5*ratio,wallOptions),
      Bodies.circle(249.5*ratio,503.5*ratio,8.5*ratio,wallOptions),

      Bodies.circle(97.5*ratio,530.5*ratio,8.5*ratio,wallOptions),
      Bodies.circle(131.5*ratio,530.5*ratio,8.5*ratio,wallOptions),
      Bodies.circle(165.5*ratio,530.5*ratio,8.5*ratio,wallOptions),
      Bodies.circle(199.5*ratio,530.5*ratio,8.5*ratio,wallOptions),
      Bodies.circle(233.5*ratio,530.5*ratio,8.5*ratio,wallOptions),
      Bodies.circle(267.5*ratio,530.5*ratio,8.5*ratio,wallOptions),
    ])
    add(Bodies.rectangle(cw / 2, ch+40, 102*ratio, 82, {label: 'dead', isStatic: true, render:{fillStyle: '#ff0000'}, collisionFilter: {mask: 0x001}}))
    add([
      Bodies.circle(29*ratio,60*ratio,6*ratio,wallOptions),
      Bodies.circle(336*ratio,60*ratio,6*ratio,wallOptions),
      Bodies.circle(29*ratio,143*ratio,6*ratio,wallOptions),
      Bodies.circle(336*ratio,143*ratio,6*ratio,wallOptions),
      Bodies.circle(142*ratio,279*ratio,6*ratio,wallOptions),
      Bodies.circle(221*ratio,279*ratio,6*ratio,wallOptions),
      Bodies.circle(161*ratio,381*ratio,5*ratio,wallOptions),
      Bodies.circle(205*ratio,381*ratio,5*ratio,wallOptions),
      Bodies.circle(131*ratio,571*ratio,6*ratio,wallOptions),
      Bodies.circle(233*ratio,571*ratio,6*ratio,wallOptions),
      Bodies.circle(181.5*ratio,107.5*ratio,11.5*ratio,wallOptions)
    ])
    var triangleVertices = [
      { x: 168*ratio, y: 144*ratio }, // Top point
      { x: 196 * ratio, y: 144*ratio }, // Left point
      { x: 182 * ratio, y: 172 * ratio }  // Right point
    ];
    add(Bodies.fromVertices(182*ratio,158*ratio,triangleVertices,{
      isStatic:true,
      render: {
          fillStyle: '#045AFF',
          strokeStyle: '#045AFF',
          lineWidth: 2
      }
    }))
  };

  const add = (body) => {
    Composite.add(world, body)
  }

  const createCircleStack = (y, count) => {
    return Composites.stack((cw - (17 * count + 17 * (count - 1)) * ratio) / 2, y, count, 1, 17 * ratio, 0, (x, y) =>
      Bodies.circle(x, y, 8.5 * ratio, { friction: 0.001, restitution: 0.5,  isStatic: true, label: 'wall', render: { fillStyle: '#045aff' }, collisionFilter: { mask: 0x001 } })
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

  const rotateHandle = (handle, direction=1) => {
    let speed=0.015*direction;
    setInterval(() => {
      Body.rotate(handle, speed);
    }, 20);
  }

  const addHandles = () => {
    const wallOptions = {label: 'wall', isStatic: true, render:{fillStyle: '#045aff'}, collisionFilter: {mask: 0x001}}

   
    const deg = Math.PI / 180
    const cross1_1 = Bodies.rectangle(141*ratio,234*ratio,70*ratio,10*ratio,wallOptions)
    const cross1_2 = Bodies.rectangle(141*ratio,234*ratio,70*ratio,10*ratio,wallOptions)
    Body.rotate(cross1_2,90*deg)
    add([cross1_1, cross1_2])
    rotateHandle(cross1_1,-1)
    rotateHandle(cross1_2,-1)
    const cross2_1 = Bodies.rectangle(225*ratio,234*ratio,70*ratio,10*ratio,wallOptions)
    const cross2_2 = Bodies.rectangle(225*ratio,234*ratio,70*ratio,10*ratio,wallOptions)
    Body.rotate(cross2_2,90*deg)
    add([cross2_1, cross2_2])
    rotateHandle(cross2_1)
    rotateHandle(cross2_2)

    const positions = [
      { x: 14 * ratio, y: [580.5, 460.5, 340.5, 220.5, 100.5] },
      { x: (defaultWidth-14) * ratio, y: [580.5, 460.5, 340.5, 220.5, 100.5] },
    ];
    
    const bodies = positions.flatMap(({ x, y }) =>
      y.map((yPos) => Bodies.rectangle(x, yPos * ratio, 28 * ratio, 5 * ratio, wallOptions))
    );
    
    add(bodies);
    
    // bodies.forEach((body, index) => {
    //   const direction = index / 4 < 1 ? Math.PI / 60 : -Math.PI / 60;
    //   Body.rotate(body, direction);
    // });
    
    setInterval(() => {
      bodies.forEach((body) => {
        const { y } = body.position;
        if (y < 30) {
          Body.setPosition(body, { x: body.position.x, y: ch+10 });
        }
        Body.translate(body, { x: 0, y: -4 }, true);
      });
    }, 20);

  

    add([
      Bodies.circle(80*ratio,281*ratio,8*ratio,wallOptions),
      Bodies.circle(281*ratio,281*ratio,8*ratio,wallOptions),    
    ])

    const handle3 = Bodies.rectangle(80*ratio,281*ratio,60*ratio,3*ratio,wallOptions)
    const handle4 = Bodies.rectangle(281*ratio,281*ratio,60*ratio,3*ratio,wallOptions)
    add([handle3,handle4])
    rotateHandle(handle3,-1)
    rotateHandle(handle4)
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
          if (ball.userId == myIndex){
            temp++;
          }
          if (temp == myCount){
            if(rank.length == 100){
              setWinner('You won!')
            }
            setWinner('You Lose!')
          }
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
            <h2 style={{textAlign:'center', fontSize: '2rem'}}>{winner}</h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default Game;
