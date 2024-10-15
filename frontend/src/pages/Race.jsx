import Matter, { Engine, Runner, Render, Composite, Composites, Common, Bodies, Body, Vertices, Svg, Constraint, Mouse, MouseConstraint, Events } from 'matter-js'
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
  const [startTitle, setStartTitle] = useState('3')

  const scene = useRef()
  const engine = useRef(Engine.create())
  const world = useMemo(()=>engine.current.world,[engine])

  const defaultWidth = 367;
  const defaultHeight = 641;
  let cw = window.innerWidth;
  let ratio = cw / defaultWidth;
  let ch = defaultHeight * ratio
  
  let render;
  const [rank, setRank] = useState([])
  let startHandler;

  useEffect(()=>{
    setTon(Number(state.ton || 1))
    setRoom(Number(state.room || 0))
    setMemberCountInRoom(Number(state.memberCountInRoom || 0))
    setMyIndex(state.myIndex)
    setUsers(state.users)
    // const userIds= ['763843','386343','873902','174942','374834']
    // const colors = ['#ffd700', '#e43292','#ff6b00','#2cca36', '#ff0219']
    // const startIndex = Common.random(0,4)
    // userIds.map((user, index) => {
    //   const x = 23.5 + 11*index + 15 * index
    //   const y = 21.5
    //   setUsers(prev => [...prev,{id:user, position:{x,y}, color:colors[index]}])
    // })
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

  useEffect(()=> {
    if (rank.length == 5){
      setWinner(rank[0].userId)
    }
  },[rank])

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
    render.options.background = '#2d2850'
    drawWorld()
    addBallsToWorld()
    const values = ['2','1','Go']
    let j = 0
    let step = 1
    const startHandlerInterval = setInterval(() => {
      if (startHandler.position.y > 55)
        step = -1
      else if (startHandler.position.y < 35)
        step = 1
      Body.setPosition(startHandler,{x:startHandler.position.x, y:startHandler.position.y+step})
      // Body.rotate(startHandler,step*0.01)
     },20)
    startHandler.collisionFilter.mask = 0x001
    engine.current.gravity.scale = 0.0004
    const startInterval = setInterval(() => {
      setStartTitle(values[j++])
      if (j > values.length){
        clearInterval(startInterval)
        if (memberCountInRoom == 5)
          clearInterval(startHandlerInterval)
          startHandler.collisionFilter.mask = 0x002
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

  function createHalfCircle(x, y, radius, segments, rotate) {
    const points = [];
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

  const drawSVG = (x,y,svg,rotate=0,direction=0.01,scale=0.1*ratio) => {
    var select = function(root, selector) {
      return Array.prototype.slice.call(root.querySelectorAll(selector));
    };

    var loadSvg = function(url) {
        return fetch(url)
            .then(function(response) { return response.text(); })
            .then(function(raw) { return (new window.DOMParser()).parseFromString(raw, 'image/svg+xml'); });
    };
    loadSvg(svg).then(function(root) {
      const paths = select(root, 'path');
      var vertexSets = paths
          .map(function(path) { 
            return Vertices.scale(Svg.pathToVertices(path, 30),scale,-scale)
          });
      // Calculate bounding box for the first path
      // const bbox = paths[0].getBBox();
      // const boxCenterX = bbox.x + bbox.width / 2;
      // const boxCenterY = bbox.y + bbox.height / 2;

      // const allVertices = vertexSets.flat();
      // const centerX = allVertices.reduce((sum, vertex) => sum + vertex.x, 0) / allVertices.length / 10;
      // const centerY = allVertices.reduce((sum, vertex) => sum + vertex.y, 0) / allVertices.length / 10;
      
      // console.log(boxCenterX,boxCenterY,centerX,centerY)

      // // Now adjust the x and y based on the center of the SVG
      // const adjustedX = x - centerX;
      // const adjustedY = y - centerY;
      // console.log(adjustedX, adjustedY)
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
      // var constraint = Constraint.create({
      //   pointA: {x:x, y:y},
      //   bodyB: body,
      //   pointB: {x:centerX, y:centerY}
      // })
      Body.rotate(body,rotate)
      setInterval(()=> Body.rotate(body,direction),20)
      add([body])
    });
  }

  const drawWorld = () => {
    const wallOptions = {label: 'wall', isStatic: true, render:{fillStyle: '#8102FF'}, collisionFilter: {mask: 0x001}}
    const wallOptionsBlack = {label: 'wall', isStatic: true, render:{fillStyle: '#111'}, collisionFilter: {mask: 0x001}}
    
    const deg = Math.PI / 180

    const wall1 = Bodies.rectangle(71.5,99.5*ratio,137*ratio,5*ratio, wallOptions)
    Body.rotate(wall1, 8*deg)
    const wall2 = Bodies.rectangle(120.5*ratio,141.5*ratio,97*ratio,5*ratio, wallOptions)
    Body.rotate(wall2, -8*deg)
    const angle1 = Common.random(0,90)
    const wall3 = Bodies.rectangle(39.5*ratio,156.5*ratio,56*ratio,10*ratio, wallOptions)
    Body.rotate(wall3, -angle1*deg)
    const wall4 = Bodies.rectangle(39.5*ratio,156.5*ratio,56*ratio,10*ratio, wallOptions)
    Body.rotate(wall4, -(angle1+90)*deg)

    rotateHandle(wall3,-1)
    rotateHandle(wall4,-1)

    const wall5 = Bodies.rectangle(96*ratio,197.5*ratio,108*ratio,5.2*ratio, wallOptions)
    Body.rotate(wall5, 8*deg)

    const wall6 = Bodies.rectangle(117.5*ratio, 241.5*ratio, 105*ratio,5.2*ratio, wallOptions)
    Body.rotate(wall6, -10*deg)

    const wall7 = Bodies.rectangle(92.5*ratio, 291.5*ratio,107*ratio,5.2*ratio,wallOptions)
    Body.rotate(wall7, 8*deg)

    const wall8 = Bodies.rectangle(116.5*ratio, 328.5*ratio,109*ratio,5.2*ratio,wallOptions)
    Body.rotate(wall8, -10*deg)

    const wall9 = Bodies.rectangle(34*ratio, 383.5*ratio,68*ratio,6.7*ratio,wallOptions)
    Body.rotate(wall9, 10*deg)

    const wall10 = Bodies.rectangle(139*ratio, 384.5*ratio,62*ratio,6.7*ratio,wallOptions)
    Body.rotate(wall10,-10*deg)

    const wall11 = Bodies.rectangle(40.5*ratio, 267.5*ratio,5.2*ratio,147*ratio,wallOptions)
    
    const angle2 = Common.random(0,90)
    const wall14 = Bodies.rectangle(92*ratio,391*ratio,30*ratio,5.2*ratio, wallOptions)
    Body.rotate(wall14, -angle2*deg)
    const wall15 = Bodies.rectangle(92*ratio,391*ratio,30*ratio,5.2*ratio, wallOptions)
    Body.rotate(wall15, -(90+angle2)*deg)

    rotateHandle(wall14)
    rotateHandle(wall15)
    
    

    add([wall1,wall2,wall3,wall4,wall5,wall6,wall7,wall8,wall9,wall10,wall11,wall14,wall15])
    
    const rw1 = Bodies.rectangle(264.5*ratio, 52.5*ratio,143*ratio,5.2*ratio,wallOptions)
    Body.rotate(rw1, 7*deg)

    const rw2 = Bodies.rectangle(270.5*ratio, 141.5*ratio,109*ratio,5.2*ratio,wallOptions)
    Body.rotate(rw2, -8*deg)

    const rw3 = Bodies.rectangle(266.5*ratio, 180.5*ratio,143*ratio,5.2*ratio,wallOptions)
    Body.rotate(rw3, 7*deg)

    const rw4 = Bodies.rectangle(229.5*ratio, 220.5*ratio,73*ratio,5.2*ratio,wallOptions)
    Body.rotate(rw4, 10*deg)

    const rw5 = Bodies.rectangle(322.5*ratio, 219.5*ratio,75*ratio,5.2*ratio,wallOptions)
    Body.rotate(rw5, -10*deg)

    const rw6 = Bodies.rectangle(243*ratio, 273.5*ratio,50*ratio,5.2*ratio,wallOptions)
    Body.rotate(rw6, -10*deg)

    const rw7 = Bodies.rectangle(307.5*ratio, 273.5*ratio,49*ratio,5.2*ratio,wallOptions)
    Body.rotate(rw7, 10*deg)

    const rw8 = Bodies.rectangle(229.5*ratio, 320.5*ratio,75*ratio,5.2*ratio,wallOptions)
    Body.rotate(rw8, 10*deg)

    const rw9 = Bodies.rectangle(324.5*ratio, 320.5*ratio,75*ratio,5.2*ratio,wallOptions)
    Body.rotate(rw9, -10*deg)

    const rw10 = Bodies.rectangle(244.5*ratio, 360.5*ratio,51*ratio,5.2*ratio,wallOptions)
    Body.rotate(rw10, -10*deg)

    const rw11 = Bodies.rectangle(308.5*ratio, 360.5*ratio,49*ratio,5.2*ratio,wallOptions)
    Body.rotate(rw11, 10*deg)

    const rw12 = Bodies.rectangle(229.5*ratio, 407.5*ratio,73*ratio,5.2*ratio,wallOptions)
    Body.rotate(rw12, 10*deg)

    const rw13 = Bodies.rectangle(325.5*ratio, 407.5*ratio,75*ratio,5.2*ratio,wallOptions)
    Body.rotate(rw13, -10*deg)

    const rw14 = Bodies.rectangle(232*ratio, 475.5*ratio,78*ratio,6.7*ratio,wallOptions)
    Body.rotate(rw14, 25*deg)

    const rw15 = Bodies.rectangle(325*ratio, 475.5*ratio,78*ratio,6.7*ratio,wallOptions)
    Body.rotate(rw15, -25*deg)

    const rw16 = Bodies.rectangle(270.5*ratio, 520*ratio,3*ratio,60*ratio,wallOptions)

    const rw17 = Bodies.rectangle(286.5*ratio, 520*ratio,3*ratio,60*ratio,wallOptions)

    add([rw1,rw2,rw3,rw4,rw5,rw6,rw7,rw8,rw9,rw10,rw11,rw12,rw13,rw14,rw15,rw16,rw17])

    const angle3 = Common.random(0,90)
    const rw18 = Bodies.rectangle(324*ratio,95*ratio,56*ratio,10*ratio, wallOptions)
    Body.rotate(rw18, -angle3*deg)
    const rw19 = Bodies.rectangle(324*ratio,95*ratio,56*ratio,10*ratio, wallOptions)
    Body.rotate(rw19, -(90+angle3)*deg)

    add([rw18,rw19])
    rotateHandle(rw18,-1)
    rotateHandle(rw19,-1)

    add([Bodies.circle(26*ratio,433*ratio,8*ratio,wallOptions),
    Bodies.circle(56*ratio,433*ratio,8*ratio,wallOptions),
    Bodies.circle(86*ratio,433*ratio,8*ratio,wallOptions),
    Bodies.circle(116*ratio,433*ratio,8*ratio,wallOptions),
    Bodies.circle(146*ratio,433*ratio,8*ratio,wallOptions)])

    add([Bodies.circle(41*ratio,460*ratio,8*ratio,wallOptions),
      Bodies.circle(73*ratio,460*ratio,8*ratio,wallOptions),
      Bodies.circle(105*ratio,460*ratio,8*ratio,wallOptions),
      Bodies.circle(137*ratio,460*ratio,8*ratio,wallOptions)])

    add([Bodies.circle(26*ratio,487*ratio,8*ratio,wallOptions),
        Bodies.circle(56*ratio,487*ratio,8*ratio,wallOptions),
        Bodies.circle(86*ratio,487*ratio,8*ratio,wallOptions),
        Bodies.circle(116*ratio,487*ratio,8*ratio,wallOptions),
        Bodies.circle(146*ratio,487*ratio,8*ratio,wallOptions)])

    add([
      Bodies.circle(40.5*ratio,190.5*ratio,5.5*ratio,wallOptions),
      Bodies.circle(40.5*ratio,284.5*ratio,5.5*ratio,wallOptions),
      Bodies.circle(40.5*ratio,338.5*ratio,5.5*ratio,wallOptions),
      Bodies.circle(325.5*ratio,133.5*ratio,5.5*ratio,wallOptions),
      Bodies.circle(270*ratio,494*ratio,4*ratio,wallOptions),
      Bodies.circle(287*ratio,494*ratio,4*ratio,wallOptions),
      Bodies.circle(276*ratio,269*ratio,15*ratio,wallOptions),
      Bodies.circle(276*ratio,356*ratio,15*ratio,wallOptions),
    ])

    // add(Composites.stack(20*ratio, 465*ratio, 5, 1, 16 * ratio, 0, (x, y) =>
    //   Bodies.circle(x, y, 8 * ratio, { friction: 0.001, restitution: 0.5,  isStatic: true, label: 'wall', render: { fillStyle: '#8102FF' }, collisionFilter: { mask: 0x001 } })
    // ));

    const handle1 = Bodies.rectangle(277.5*ratio, 293.5*ratio,3*ratio,59*ratio,wallOptions)
    const handle2 = Bodies.rectangle(277.5*ratio, 380.5*ratio,3*ratio,59*ratio,wallOptions)
    Body.rotate(handle1,-45*deg, { x: 277.5*ratio, y: 269*ratio })
    Body.rotate(handle2,-45*deg, { x: 277.5*ratio, y: 356*ratio })
    add([handle1, handle2])

    movingHandle(handle1,90*deg,0*deg,{ x: 277.5*ratio, y: 269*ratio })
    movingHandle(handle2,90*deg,0*deg,{ x: 277.5*ratio, y: 356*ratio })

    var triangleVertices = [
      { x: 10*ratio, y: 509*ratio }, // Top point
      { x: 10 * ratio, y: 552*ratio }, // Left point
      { x: 177 * ratio, y: 552 * ratio }  // Right point
    ];
    add(Bodies.fromVertices(59*ratio,538*ratio,triangleVertices,{
      isStatic:true,
      render: {
          fillStyle: '#111',
          strokeStyle: '#111',
          lineWidth: 2
      }
    }))

    var triangleVertices = [
      { x: 278*ratio, y: 434*ratio }, // Top point
      { x: 264 * ratio, y: 462*ratio }, // Left point
      { x: 292 * ratio, y: 462 * ratio }  // Right point
    ];
    add(Bodies.fromVertices(278*ratio,448*ratio,triangleVertices,{
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
      { x:  180 * ratio, y: 7 * ratio }  // Right point
    ];
    add(Bodies.fromVertices(180*ratio,3.5*ratio,triangleVertices1,{
      isStatic:true,
      render: {
          fillStyle: '#111',
          strokeStyle: '#111',
          lineWidth: 2
      }
    }))
    const final = Bodies.rectangle(279*ratio, 556*ratio, 167*ratio, 15*ratio, {label: 'dead', isStatic: true,density: 0.8, restitution: 0.6, render:{sprite: {texture: '/imgs/final.png', xScale: ratio, yScale: ratio}}, collisionFilter: {mask: 0x001}})
    add(final)

    //elevator
    let bodies = []
    let cy = defaultHeight / 24
    for(let i = 0; i < 24; i++){
      bodies.push(Bodies.rectangle(186*ratio,cy*i*ratio,26*ratio,3*ratio,wallOptions))
    }
    
    add(bodies);
    
    setInterval(() => {
      bodies.forEach((body) => {
        const { y } = body.position;
        if (y < 30) {
          Body.setPosition(body, { x: body.position.x, y: ch+10 });
        }
        Body.translate(body, { x: 0, y: -2 }, true);
      });
    }, 20);
    startHandler = Bodies.rectangle(87*ratio, 43*ratio, 152*ratio, 6*ratio, {label: 'start', isStatic: true,density: 0.8, restitution: 0.6, render:{fillStyle: '#fff'}, collisionFilter: {mask: 0x002}})
    add(startHandler)
    
    add([
      Bodies.rectangle(cw / 2*ratio, ch+40*ratio, cw*ratio, 90*ratio, wallOptionsBlack),
      Bodies.rectangle(-35*ratio, ch / 2*ratio, 90*ratio, ch*ratio, wallOptionsBlack),
      Bodies.rectangle(cw+35*ratio, ch / 2*ratio, 90*ratio, ch*ratio, wallOptionsBlack),
      Bodies.rectangle(cw / 2*ratio, -40*ratio, cw*ratio, 81*ratio, wallOptionsBlack),
      Bodies.rectangle(172.5*ratio,256*ratio,9*ratio,512*ratio,wallOptionsBlack),
      Bodies.rectangle(88.5*ratio,603*ratio,177*ratio,100*ratio,wallOptionsBlack),
      Bodies.rectangle(194.5*ratio,343.5*ratio,9*ratio,609*ratio,wallOptionsBlack),
    ])

    
    
  };


  const add = (body) => {
    Composite.add(world, body)
  }

  const movingHandle = (handle,angleLimitPositive,angleLimitNegative,center) => {
    let angle = 0;
    let direction = 1;
    let speed=0.015;
    setInterval(() => {
      if (angle > angleLimitPositive) direction = -1;
      else if (angle < angleLimitNegative) direction = 1;
      
      angle += direction * speed;
      Body.rotate(handle, direction * speed,center);
    }, 20);
  }

  const rotateHandle = (handle, direction=1) => {
    let speed=0.015*direction;
    setInterval(() => {
      Body.rotate(handle, speed);
    }, 20);
  }


  const addBallsToWorld = () => {
    const stack = users.map((user, i) => 
      Bodies.circle(
        user.position.x*ratio,
        user.position.y*ratio,
        4.5*ratio,
        {
          label: "ball",
          index: i,
          color: user.color,
          userId:user.id,
          friction: 0.0001,
          frictionAir: 0,
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

  const handleCollisionEvent = () => {
    Matter.Events.off(engine.current, 'collisionStart');
    Matter.Events.on(engine.current, 'collisionStart', function (event) {
      event.pairs.forEach(function (pair) {
        const ball = pair.bodyA.label === 'ball' ? pair.bodyA : pair.bodyB.label === 'ball' ? pair.bodyB : null;
        const dead = pair.bodyA.label === 'dead' ? pair.bodyA : pair.bodyB.label === 'dead' ? pair.bodyB : null;

        if (ball && dead) {
          Composite.remove(world, ball);
          setRank((prev) => [...prev,ball])
        }
      });
    });
    // Matter.Events.off(engine.current, 'collisionActive');
    // Matter.Events.on(engine.current, 'collisionActive', function (event) {
    //   event.pairs.forEach(function (pair) {
    //     const ball = pair.bodyA.label === 'ball' ? pair.bodyA : pair.bodyB.label === 'ball' ? pair.bodyB : null;
    //     const wall = pair.bodyA.label === 'wall' ? pair.bodyA : pair.bodyB.label === 'wall' ? pair.bodyB : null;
    //     const alive = pair.bodyA.label === 'alive' ? pair.bodyA : pair.bodyB.label === 'alive' ? pair.bodyB : null;
    //     if (ball && wall) {
    //       const velocity = ball.velocity;
    //       if (velocity.x > 3)
    //         Body.setVelocity(ball,{x:3, y: velocity.y})
    //       if (velocity.y < 0.001){
    //         Body.setPosition(ball,{x:ball.position.x-1, y:ball.position.y})
    //       }
    //     }
    //     if (ball && alive){
    //       Body.setPosition(ball,{x:Common.random((cw / 2 - 50), (cw / 2 + 50)),y:Common.random(60*ratio, 80*ratio)})
    //     }
    //   })
    // })
  }

  const handleMenuButton = (e) => {
    e.preventDefault()
    navigate('/', {replace: true})
  }
  
  return (
    <div className='relative'>
      <div ref={scene} style={{width: '100%'}}/>
      <div>
        <div style={{position: 'absolute', top: '10px', left: '12px', color: 'white', display: 'flex', gap: '1em'}}>
          <h5 style={{margin:'6px 0px'}}>Room: {room}</h5>
          <h5 style={{margin:'6px 0px'}}>Ton: {ton}</h5>
          <h5 style={{margin:'6px 0px'}}>Members: {memberCountInRoom}</h5>
        </div>
        <div  className='text-[#BF4F74] text-lg m-1 py-1 px-4 border-[2px] border-solid border-[#BF4F74] rounded-sm bg-[#333] cursor-pointer' onClick={handleMenuButton} style={{position: 'absolute', top: '10px', right: '12px'}}>Menu</div>
        {/*<div style={{position: 'absolute', top: ch / 2 - 88, color: 'white', width: '100%'}}>
            <h1 style={{textAlign:'center', fontSize: '2.5rem'}}>Finished</h1>
            <h2 style={{textAlign:'center', fontSize: '2rem'}}>The winner is {winner}</h2>

          </div>*/}
          {winner!='' && console.log(rank)}
        {winner != '' && (
          <div style={{position: 'absolute', left:'25%', top: ch / 2 - 88, color: 'white', width: '50%'}} className='z-100 flex flex-col gap-3 items-center align-middle justify-center bg-slate-700 opacity-40 p-3 rounded-lg'>
            {rank.map((bal) => {
              console.log(bal)
              return (<div className={`w-[11px] h-[11px] rounded-full`} style={{backgroundColor: bal.color}}></div>)
            })}
          </div>
        )}
      </div>
      <div className='absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'>
        <span className='font-roboto font-bold text-white text-[72px]'>{startTitle}</span>
      </div>
    </div>
  );
}

export default Race;
