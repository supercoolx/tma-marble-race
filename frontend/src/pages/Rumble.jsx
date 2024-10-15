import API from '@/libs/api';
import { useInitData } from '@telegram-apps/sdk-react';
import Matter, { Engine, Runner, Render, Composite, Composites, Common, Bodies, Body } from 'matter-js'
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Rumble () {
  const { state } = useLocation();
  const navigate = useNavigate();
  const {user} = useInitData();
  const [ton, setTon] = useState()
  const [room, setRoom] = useState()
  const [memberCountInRoom, setMemberCountInRoom] = useState()
  const [myIndex, setMyIndex] = useState()
  const [myCount, setMyCount] = useState()
  const [users, setUsers] = useState([])
  const [finish, setFinish] = useState(false)
  const [win, setWin] = useState(false)
  const [startTitle, setStartTitle] = useState('3')
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
    const values = ['2','1','Go']
    let j = 0
    addBallsToWorld(0,100)
    engine.current.gravity.scale = 0
    const startInterval = setInterval(() => {
      setStartTitle(values[j++])
      if (j > values.length){
        clearInterval(startInterval)
        if (memberCountInRoom == 100)
          engine.current.gravity.scale = 0.0004
      }
    },1000)
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
      Bodies.rectangle(130.5*ratio,592.5*ratio,5.6*ratio,47*ratio, wallOptions),
      Bodies.rectangle(232.5*ratio,592.5*ratio,5.6*ratio,47*ratio, wallOptions),
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
    const wall12 = Bodies.rectangle(67*ratio, 582.5*ratio, 134*ratio,5.6*ratio, wallOptions)
    Body.rotate(wall12, -10*deg)
    const wall13 = Bodies.rectangle(312.5*ratio, 585.5*ratio, 159*ratio,5.6*ratio, wallOptions)
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
    add(Bodies.rectangle(cw / 2, ch+40, 122*ratio, 82, {label: 'dead', isStatic: true, render:{fillStyle: '#ff0000'}, collisionFilter: {mask: 0x001}}))
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
    var triangle1 = Bodies.fromVertices(182*ratio,158*ratio,triangleVertices,{
      isStatic:true,
      render: {
          fillStyle: '#045AFF',
          strokeStyle: '#045AFF',
          lineWidth: 2
      }
    })
    add(triangle1)
    rotateHandle(triangle1)
    var triangleVertices = [
      { x: 0*ratio, y: 0*ratio }, // Top point
      { x: 90 * ratio, y: 0*ratio }, // Left point
      { x: 0 * ratio, y: 90 * ratio }  // Right point
    ];
    add(Bodies.fromVertices(2.25*ratio,2.25*ratio,triangleVertices,{
      isStatic:true,
      render: {
          fillStyle: '#045AFF',
          strokeStyle: '#045AFF',
          lineWidth: 2
      }
    }))
    var triangleVertices = [
      { x: (defaultWidth-90)*ratio, y: 0*ratio }, // Top point
      { x: defaultWidth* ratio, y: 0*ratio }, // Left point
      { x: (defaultWidth) * ratio, y: 90 * ratio }  // Right point
    ];
    add(Bodies.fromVertices((defaultWidth-2.25)*ratio,2.25*ratio,triangleVertices,{
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

  const addBallsToWorld = (from, to) => {
    if (to > 100)
      to = 100
    const stack = []
    for (let i = from; i < to; i++)
    {
      const render = users[i].id == myIndex ? {
        fillStyle:'#ff8801'
        // sprite: { texture: '/imgs/ball_optimized.png', xScale: 0.15625*ratio+cw/3000, yScale: 0.15625*ratio+cw/3000 }
      }:{
        // sprite: { texture: '/imgs/ball_other_optimized.png', xScale: 0.15625*ratio+cw/3000, yScale: 0.15625*ratio+cw/3000 }
        fillStyle: '#ffffff'
      }
      stack.push(Bodies.circle(
        users[i].position.x,
        users[i].position.y,
        5*ratio + cw / 30000,
        {
          label: "ball",
          index: i,
          userId:users[i].id,
          friction: 0.0001,
          frictionAir:0,
          density: 0.3,
          restitution: 0.8,
          render: render,
          collisionFilter: { mask: 0x001 }
        }
      ))
    }
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
            setFinish(true)
            if(rank.length == 100){
              setWin(true)
            }else{
              setWin(false)
            }
            temp=0;
          }
          if (rank.length == 99 && temp != myCount){
            setWin(true)
            setFinish(true)
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
  
  const handleClaim = (e) => {
    e.preventDefault()
    API.post("/users/winMarble",{userid:user.id, balance: ton*100}).then(res=>{
      navigate('/')
    })
  }

  return (
    <div className='relative'>
      <div ref={scene} className='w-full'/>
      <div>
        <div style={{position: 'absolute', top: '10px', left: '12px', color: 'white', display: 'flex', gap: '1em'}}>
          <h5 style={{margin:'6px 0px'}}>Room: {room}</h5>
          <h5 style={{margin:'6px 0px'}}>Ton: {ton}</h5>
          <h5 style={{margin:'6px 0px'}}>Members: {memberCountInRoom}</h5>
        </div>
        {/* <div  className='text-[#BF4F74] text-lg m-1 py-1 px-4 border-[2px] border-solid border-[#BF4F74] rounded-sm bg-[#333] cursor-pointer' onClick={handleMenuButton} style={{position: 'absolute', top: '10px', right: '12px'}}>Menu</div> */}
        {/* {winner != '' && (
          <div style={{position: 'absolute', top: ch / 2 - 88, color: 'white', width: '100%'}}>
            <h1 style={{textAlign:'center', fontSize: '2.5rem'}}>Finished</h1>
            <h2 style={{textAlign:'center', fontSize: '2rem'}}>{winner}</h2>
          </div>
        )} */}
      </div>
      <div className='absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'>
        <span className='font-roboto font-bold text-white text-[72px]'>{startTitle}</span>
      </div>
      {finish && !win && (
      <div className='absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] border-[1px] border-[#8102ff] rounded-md bg-black/75 '>
        <div className='flex flex-col text-center justify-center items-center p-[20px]'>
          <svg className='w-[32px] h-[32px] mb-[15px]' fill="#fff" preserveAspectRatio="xMidYMid meet" data-bbox="32.444 32.443 135.112 135.114" viewBox="32.444 32.443 135.112 135.114" height="200" width="200" xmlns="http://www.w3.org/2000/svg" data-type="color" role="presentation" aria-hidden="true" aria-label="">
            <g>
                <path d="M100 32.443c-37.251 0-67.556 30.306-67.556 67.557S62.749 167.557 100 167.557c37.25 0 67.556-30.306 67.556-67.557S137.25 32.443 100 32.443zm0 123.166c-30.663 0-55.61-24.946-55.61-55.609S69.337 44.389 100 44.389 155.611 69.337 155.611 100c0 30.663-24.948 55.609-55.611 55.609z" data-color="1"></path>
                <path d="M113.462 121.456H86.54a4.307 4.307 0 1 0 0 8.614h26.922a4.308 4.308 0 1 0 0-8.614z" data-color="1"></path>
                <path d="M130.602 81.389a3.552 3.552 0 0 0-5.029 0l-5.346 5.345-5.347-5.345a3.55 3.55 0 0 0-5.027 0 3.554 3.554 0 0 0 0 5.029l5.345 5.347-5.345 5.345a3.556 3.556 0 0 0 0 5.031 3.54 3.54 0 0 0 2.514 1.043c.91 0 1.821-.348 2.513-1.043l5.347-5.347 5.346 5.347c.694.695 1.606 1.043 2.516 1.043s1.82-.348 2.513-1.043a3.553 3.553 0 0 0 0-5.031l-5.343-5.345 5.343-5.347a3.55 3.55 0 0 0 0-5.029z" data-color="1"></path>
                <path d="M85.117 102.141a3.543 3.543 0 0 0 2.516 1.043 3.556 3.556 0 0 0 2.515-6.074l-5.346-5.345 5.346-5.347a3.554 3.554 0 0 0 0-5.029 3.554 3.554 0 0 0-5.031 0l-5.347 5.345-5.343-5.345a3.553 3.553 0 0 0-5.03 0 3.556 3.556 0 0 0 0 5.029l5.347 5.347-5.347 5.345a3.558 3.558 0 0 0 5.03 5.031l5.343-5.347 5.347 5.347z" data-color="1"></path>
            </g>
          </svg>
          <span className='font-roboto text-[16px] text-white font-bold mb-[12px]'>Eliminate!</span>
          <span className='font-roboto text-[16px] text-[#6E6E6E] font-bold mb-[25px] w-[232px]'>All your balls are eliminated</span>
          <div onClick={handleMenuButton} className='px-[48px] py-[7px] bg-[#8102FF] rounded-md text-center flex flex-row items-center'>
            <span className='font-roboto text-[12px] text-white font-bold'>Continue</span>
          </div>
        </div>
      </div>)}
      {finish && win && (
      <div className='absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] border-[1px] border-[#8102ff] rounded-md bg-black/75 '>
        <div className='flex flex-col text-center justify-center items-center p-[20px]'>
          <svg className='w-[32px] h-[32px] mb-[15px]' fill="#fff" preserveAspectRatio="xMidYMid meet" data-bbox="30 52 140 96" viewBox="30 52 140 96" height="200" width="200" xmlns="http://www.w3.org/2000/svg" data-type="color" role="presentation" aria-hidden="true" aria-label="">
              <g>
                  <path d="M155.217 127.447l-2.216-5.373c2.875-1.182 5.358-3.773 8.477-8.967-3.247-1.309-6.559-1.56-9.704-.718-5.005 1.339-9.511 5.315-13.033 11.499l-5.056-2.874c4.309-7.564 10.042-12.488 16.584-14.236 5.534-1.479 11.317-.579 16.74 2.593l2.446 1.433-1.372 2.478c-3.815 6.898-7.463 11.946-12.866 14.165z" data-color="1"></path>
                  <path d="M135.753 148c-.315 0-.631-.007-.946-.023-5.329-.267-10.545-2.803-15.504-7.537l-2.102-2.006 2.011-2.101c5.536-5.788 11.908-9.086 18.427-9.533 6.46-.44 12.632 1.915 17.78 6.825l2.102 2.007-2.011 2.101C148.99 144.55 142.346 148 135.753 148zm-10.124-9.764c3.162 2.46 6.338 3.781 9.468 3.939 4.548.21 9.156-1.888 13.982-6.279-3.378-2.431-7.141-3.569-11.042-3.299-4.239.29-8.483 2.228-12.408 5.639z" data-color="1"></path>
                  <path d="M146.86 105.013l-5.806-.386c1.068-16.078 11.513-26.245 26.043-25.276l2.903.191-.193 2.899c-.679 10.218-4.014 17.472-9.911 21.56l-3.318-4.771c3.809-2.641 6.196-7.371 7.113-14.082-9.693.679-16.047 8.044-16.831 19.865z" data-color="1"></path>
                  <path d="M140.483 85.989c-4.954-15.339 1.014-28.639 14.851-33.097L158.1 52l.895 2.764c3.15 9.761 2.73 17.741-1.253 23.721l-4.846-3.217c2.574-3.864 3.048-9.147 1.417-15.733-8.755 4.207-11.934 13.395-8.292 24.669l-5.538 1.785z" data-color="1"></path>
                  <path d="M44.783 127.447c-5.403-2.22-9.05-7.268-12.865-14.166l-1.372-2.478 2.446-1.433c5.426-3.172 11.215-4.072 16.74-2.593 6.542 1.749 12.275 6.672 16.584 14.236l-5.056 2.874c-3.522-6.184-8.028-10.16-13.033-11.499-3.15-.843-6.46-.591-9.704.718 3.119 5.194 5.602 7.786 8.477 8.967l-2.217 5.374z" data-color="1"></path>
                  <path d="M64.247 148c-6.593 0-13.238-3.45-19.757-10.266l-2.011-2.101 2.102-2.007c5.147-4.91 11.289-7.265 17.78-6.825 6.519.447 12.891 3.745 18.427 9.533l2.011 2.101-2.102 2.006c-4.96 4.735-10.175 7.271-15.504 7.537-.315.015-.63.022-.946.022zm-13.325-12.105c4.826 4.39 9.428 6.485 13.982 6.279 3.13-.157 6.306-1.479 9.468-3.939-3.926-3.411-8.17-5.349-12.408-5.64-3.89-.256-7.662.869-11.042 3.3z" data-color="1"></path>
                  <path d="M53.14 105.013c-.784-11.821-7.139-19.185-16.831-19.865.918 6.71 3.304 11.441 7.113 14.082l-3.318 4.771c-5.897-4.088-9.232-11.342-9.911-21.56L30 79.542l2.903-.191c14.522-.977 24.972 9.195 26.043 25.276l-5.806.386z" data-color="1"></path>
                  <path d="M59.517 85.989l-5.539-1.784c3.642-11.273.463-20.462-8.292-24.669-1.631 6.586-1.156 11.869 1.417 15.733l-4.846 3.217c-3.983-5.98-4.403-13.96-1.253-23.721L41.9 52l2.767.892c13.836 4.458 19.805 17.759 14.85 33.097z" data-color="1"></path>
                  <path d="M116.516 124.188c-.46 0-.92-.108-1.344-.328l-15.181-7.893-15.175 7.807a2.909 2.909 0 1 1-4.182-3.169l3.301-16.025-12.677-12.202a2.903 2.903 0 1 1 1.784-4.987l17.038-1.387 7.264-16.287c.466-1.048 1.508-1.723 2.656-1.723s2.19.675 2.656 1.723l7.264 16.287 17.038 1.387a2.913 2.913 0 0 1 2.505 1.919 2.907 2.907 0 0 1-.724 3.069l-12.678 12.184 3.304 16.139a2.905 2.905 0 0 1-2.849 3.486zM100 109.791c.46 0 .923.109 1.344.328l11.099 5.771-2.4-11.73a2.898 2.898 0 0 1 .832-2.675l9.184-8.827-12.329-1.004a2.907 2.907 0 0 1-2.42-1.713L100 78.038l-5.309 11.903a2.907 2.907 0 0 1-2.42 1.713l-12.337 1.004 9.195 8.848a2.906 2.906 0 0 1 .829 2.678l-2.4 11.644 11.11-5.715a2.92 2.92 0 0 1 1.332-.322z" data-color="1"></path>
              </g>
          </svg>
          <span className='font-roboto text-[16px] text-white font-bold mb-[12px]'>Winner!</span>
          <span className='font-roboto text-[16px] text-[#6E6E6E] font-bold mb-[25px] w-[192px]'>Your ball won the Rumble!</span>
          <span className='font-roboto text-[12px] text-white font-bold mb-[7px]'>You won:</span>
          <div className='flex flex-row items-center gap-2 bg-[#27292D] rounded-md px-[20px] py-[8px] mb-[28px]'>
            <img className='w-[13px] h-[13px]' src="/imgs/marble_ball.webp" alt=''/>
            <span className='font-roboto text-white text-[16px] font-bold'>{ton*100}</span>
            <span className='font-roboto text-[#6E6E6E] text-[12px] font-bold'>${ton*200} @TGE</span>
          </div>
          <div onClick={handleClaim} className='px-[48px] py-[7px] bg-[#8102FF] rounded-md text-center flex flex-row items-center'>
            <span className='font-roboto text-[12px] text-white font-bold'>Claim $Marbles</span>
          </div>
        </div>
      </div>)}
    </div>
  );
}

export default Rumble;
