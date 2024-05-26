/** @jsxImportSource react */
interface Point {
    x: number,
    y: number
}

const getPoint = (center: Point, edgePoint:Point, edgeFactor: number, pointFactor:number) => {
    const factorY = (center.y - edgePoint.y)/edgeFactor
    const factorX = (center.x - edgePoint.x)/edgeFactor
    return {
        x: center.x - pointFactor*factorX,
        y: center.y - pointFactor*factorY
    }
}


export default function SkillGraph(
{
    factorA = 0.4,
    factorB = 0.2,
    factorC = 0.2
}:{
    factorA?: number,
    factorB?: number,
    factorC?: number,
}
) {
    const base = 0.4
    const sqrt3 = Math.sqrt(3)
    const centerPoint = {
        x: 60,
        y: 80/sqrt3 + 10
    }
    const edgePointA = {
        x: 20,
        y: 40/sqrt3 + 10,
    }

    const edgePointB = {
        x: 100,
        y: 40/sqrt3 + 10,
    }

    const edgePointC = {
        x: 60,
        y: 160/sqrt3 + 10,
    }

    const PA = getPoint(centerPoint,edgePointA,base, factorA)
    const PB = getPoint(centerPoint,edgePointB,base, factorB)
    const PC = getPoint(centerPoint,edgePointC,base, factorC)
// 50,78 90,10 10,10
    return (
        <>
<svg height="145" viewBox={`0 0 125 125`} xmlns="http://www.w3.org/2000/svg">
    <circle cx={centerPoint.x} cy={centerPoint.y} r={80/sqrt3}
        className="fill-gray-100/30"
        filter="url(#blur)"
    />
  {/* <polygon points={`${edgePointA.x},${edgePointA.y} ${edgePointB.x},${edgePointB.y} ${edgePointC.x},${edgePointC.y}`}
  className="fill-gray-300"
 /> */}
    <circle cx={PA.x} cy={PA.y}  />
    <text x={edgePointA.x - 10}   y={edgePointA.y} fill="url(#gradient1)"  className="text-[8px] font-bold text-white">Acc</text>
    <text x={edgePointA.x - 20}   y={edgePointA.y + 10} fill="url(#gradient1)" className="text-[8px] font-bold text-white">{(factorA * 100).toFixed(2)}%</text>
    <text x={edgePointB.x - 6 }   y={edgePointB.y} fill="url(#gradient1)" className="text-[8px] font-bold text-white">Tech</text>
    <text x={edgePointB.x - 6 }   y={edgePointB.y + 8} fill="url(#gradient1)" className="text-[8px] font-bold text-white">{(factorB * 100).toFixed(2)}%</text>
    <text x={edgePointC.x - 6}   y={edgePointC.y + 2} fill="url(#gradient1)" className="text-[8px] font-bold text-white">Pass</text>
    <text x={edgePointC.x - 8}   y={edgePointC.y + 12} fill="url(#gradient1)" className="text-[8px] font-bold text-white">{(factorC * 100).toFixed(2)}%</text>
        {/* 数据点b */}
    <circle cx={PB.x} cy={PB.y}  />
    {/* 数据点c */}
    <circle cx={PC.x} cy={PC.y}/>

    <line x1={PA.x} y1={PA.y} x2={PC.x} y2={PC.y}  />
    <line x1={PA.x} y1={PA.y} x2={PB.x} y2={PB.y}  />
    <line x1={PC.x} y1={PC.y} x2={PB.x} y2={PB.y} />
    <polygon points={`${PA.x},${PA.y} ${PB.x},${PB.y} ${PC.x},${PC.y}`} fill="url(#gradient)"/>
    <defs>

    <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%" opacity={0}>
      <stop offset="0%" style={{
        stopColor: 'rgb(252 165 165)',
        stopOpacity: 1
      }} />
      <stop offset="100%" style={{
        stopColor:"rgb(147 197 253)",
        stopOpacity: 1
      }} />
    </linearGradient>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%" opacity={0}>
      <stop offset="0%" style={{
        stopColor:"red",
        stopOpacity: 0.3
      }} />
      <stop offset="100%" style={{
        stopColor:"blue",
        stopOpacity: 0.4
      }} />
    </linearGradient>
    <filter id="blur">
      <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
    </filter>
  </defs>
    </svg>
        </>
    )

}
