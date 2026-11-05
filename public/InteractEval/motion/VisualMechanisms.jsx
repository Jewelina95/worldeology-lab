import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

// Authored visual metaphors. Measured results live in the separate data panel.
const green='#234e3b',sage='#8ca58a',pale='#dce7d7',line='#c5d2c1',rust='#a05b35',gold='#c59a55',paper='#f5f8f1',muted='#607266';
const timing={extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.bezier(.22,.8,.24,1)};
function usePhase(start,end){const frame=useCurrentFrame(),{fps}=useVideoConfig();return interpolate(frame,[start*fps,end*fps],[0,1],timing);}
function Scene({label,children}){return <AbsoluteFill style={{fontFamily:'"DM Sans",Arial,sans-serif'}}><svg viewBox="0 0 480 300" role="img" aria-label={label} style={{overflow:'hidden'}}>
 <defs>
  <linearGradient id="scene-jade" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#b5cbb4"/><stop offset=".5" stopColor="#7f9f87"/><stop offset="1" stopColor="#456e57"/></linearGradient>
  <linearGradient id="scene-ivory" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#fffef7"/><stop offset="1" stopColor="#e8eadb"/></linearGradient>
  <linearGradient id="scene-leather" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#dec49a"/><stop offset=".55" stopColor="#bd9663"/><stop offset="1" stopColor="#947247"/></linearGradient>
  <linearGradient id="scene-brass" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#f1d69b"/><stop offset=".4" stopColor="#c9a45d"/><stop offset="1" stopColor="#9e793b"/></linearGradient>
  <radialGradient id="scene-wash"><stop stopColor="#d6e3d1" stopOpacity=".6"/><stop offset="1" stopColor="#f7f8ef" stopOpacity="0"/></radialGradient>
  <radialGradient id="scene-glass-green" cx=".3" cy=".2" r=".9"><stop stopColor="#fffef5" stopOpacity=".65"/><stop offset=".6" stopColor="#c5d8bc" stopOpacity=".45"/><stop offset="1" stopColor="#82a285" stopOpacity=".4"/></radialGradient>
  <radialGradient id="scene-glass-amber" cx=".3" cy=".2" r=".9"><stop stopColor="#fffdf0" stopOpacity=".75"/><stop offset=".6" stopColor="#e3d0a2" stopOpacity=".4"/><stop offset="1" stopColor="#c5a05d" stopOpacity=".35"/></radialGradient>
  <pattern id="scene-grain" width="31" height="37" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r=".45" fill="#55715b" opacity=".04"/><circle cx="19" cy="26" r=".35" fill="#8c774f" opacity=".035"/></pattern>
 </defs>
 <ellipse cx="253" cy="163" rx="225" ry="150" fill="url(#scene-wash)"/>
 {children}
 <path d="M0 0H480V300H0Z" fill="url(#scene-grain)" pointerEvents="none"/>
 </svg></AbsoluteFill>;}
function Trace({d,start=.4,end=2.4,color=green,width=3,dashed=false}){const p=usePhase(start,end);return <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray={dashed?'.015 .025':'1'} strokeDashoffset={1-p}/>;}
function Appear({start=.3,children}){const p=usePhase(start,start+.45);return <g opacity={p}>{children}</g>;}
function Check({x,y,r=10,color=green}){return <g transform={`translate(${x} ${y})`}><ellipse cy={r+3} rx={r*.9} ry="3" fill={green} opacity=".1"/><circle r={r+2} fill="#f9faf2" stroke={line}/><circle r={r} fill={color}/><path d={`M${-r*.43} 0l${r*.3} ${r*.3} ${r*.6} ${-r*.65}`} fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></g>;}
function Flag({x,y}){return <g transform={`translate(${x} ${y})`}><ellipse cy="23" rx="15" ry="4" fill={green} opacity=".1"/><path d="M0 21v-40" stroke={green} strokeWidth="2.5" strokeLinecap="round"/><circle cy="-20" r="2.8" fill="url(#scene-brass)"/><path d="M2-16c9-6 16 5 26 0v17c-10 5-17-6-26 0Z" fill="url(#scene-jade)" stroke={green} strokeWidth="1.1"/><path d="M13-16v18M3-14c8-3 15 5 23 0" fill="none" stroke="#edf3e6" strokeWidth=".8" opacity=".65"/></g>;}
function Person({x,y,flip=false}){return <g transform={`translate(${x} ${y}) scale(${flip?-1:1} 1)`}><circle cy="-18" r="15" fill={pale} stroke={green} strokeWidth="1.8"/><path d="M-24 34v-8c0-18 10-26 24-26s24 8 24 26v8" fill={pale} stroke={green} strokeWidth="1.8"/><circle cx="5" cy="-19" r="1.8" fill={green}/><path d="M4-12q5 3 8-1" fill="none" stroke={green} strokeWidth="1.5" strokeLinecap="round"/></g>;}
function Key({x,y,scale=1,opacity=1}){return <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity} fill="none" stroke="url(#scene-brass)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><circle cx="-9" r="7"/><circle cx="-9" r="3.8" stroke="#fff4ce" strokeWidth=".7"/><path d="M-2 0h23m-4 0v6m-7-6v5"/><path d="M-3-1h22" stroke="#f9e9bb" strokeWidth=".9"/></g>;}

function SubmergedState(){
 const reveal=usePhase(.4,1.9),scan=usePhase(1.3,3.5);
 return <g>
  <g opacity={.18+.82*reveal}>
   <path d="m126 106 25 91 85 63 100-56 35-98Z" fill="url(#scene-jade)"/>
   <path d="m126 106 110 154 2-154Z" fill="#b7d1bc"/>
   <path d="m238 106-2 154 100-56 35-98Z" fill="#759a82" opacity=".75"/>
   <path d="m126 106 25 91 87-91Zm112 0 98 98 35-98Z" fill="#d7e8d6" opacity=".7"/>
   <path d="m151 197 85 63-28-80Zm87-91-30 74 128 24Z" fill="#eaf4e6" opacity=".28"/>
   <path d="m126 106 82 74 28 80m-28-80 163-74M151 197l185 7" fill="none" stroke="#edf6e9" strokeWidth=".8" opacity=".5"/>
   <path d="m126 106 110 154 100-56 35-98M151 197l87-91 98 98" fill="none" stroke="#769c7d" strokeWidth="1" opacity=".6"/>
  </g>
  <path d={`M117 ${118+scan*112}q122 17 264 0`} fill="none" stroke="#fff" strokeWidth="2" opacity={scan<.98?.8:0}/>
  <Appear start={1.2}><g transform="translate(142 162)"><path d="M-13 0q13-15 26 0-13 15-26 0" fill={paper} stroke={green} strokeWidth="1.5"/><circle r="4" fill={green}/></g><text x="90" y="192" textAnchor="middle" fill={muted} fontSize="20">Belief</text><path d="M112 181l19-13" stroke={sage}/></Appear>
  <Appear start={1.7}><circle cx="238" cy="212" r="12" fill={paper} stroke={green} strokeWidth="1.5"/><circle cx="238" cy="212" r="5" fill={green}/><path d="M238 225v32" stroke={sage}/><text x="238" y="283" textAnchor="middle" fill={muted} fontSize="20">Goal</text></Appear>
  <Appear start={2.2}><path d="M331 158c-13-16-25 2 0 20 25-18 13-36 0-20" fill={paper} stroke={green} strokeWidth="1.5"/><path d="M344 177l22 14" stroke={sage}/><text x="389" y="198" textAnchor="middle" fill={muted} fontSize="20">Trust</text></Appear>
 </g>;
}
export function IcebergMechanism(){return <Scene label="A small spoken reply sits above the water; a much larger iceberg below reveals beliefs, goals and trust.">
 <defs><linearGradient id="ice-water" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#dae8dc" stopOpacity=".45"/><stop offset="1" stopColor="#edf3e8" stopOpacity="0"/></linearGradient></defs>
 <path d="M18 105H462V290H18Z" fill="url(#ice-water)"/>
 <ellipse cx="243" cy="111" rx="138" ry="7" fill="#517a64" opacity=".08"/>
 <path d="m178 103 59-65 52 65Z" fill="#fdfefb" stroke={sage} strokeWidth="1.2"/><path d="m237 38 12 65h40Z" fill="#b4c9b5"/><path d="m237 38-20 65h32Z" fill="#e4eddf"/>
 <SubmergedState/>
 <g fill="none" stroke="#a3bca9" strokeWidth=".8" opacity=".35"><path d="M29 130q35-6 67 0m288 13q36-5 63 0M35 236q34-5 62 0m278 17q35-5 66 0"/><circle cx="106" cy="169" r="3"/><circle cx="399" cy="221" r="4"/><circle cx="408" cy="204" r="2"/></g>
 <path d="M20 105q30-6 60 0t60 0 60 0 60 0 60 0 60 0 60 0" fill="none" stroke={sage} strokeWidth="1.4"/>
 <text x="240" y="25" textAnchor="middle" fill={green} fontSize="23">“I understand.”</text>
 </Scene>;}

function JourneyDot(){
 const p=usePhase(.5,3.1),t=p<.5?p*2:(p-.5)*2,q=1-t;
 const pts=p<.5?[[58,145],[134,170],[168,118],[240,112]]:[[240,112],[312,106],[350,98],[420,80]];
 const x=q*q*q*pts[0][0]+3*q*q*t*pts[1][0]+3*q*t*t*pts[2][0]+t*t*t*pts[3][0];
 const y=q*q*q*pts[0][1]+3*q*q*t*pts[1][1]+3*q*t*t*pts[2][1]+t*t*t*pts[3][1];
 return <g><ellipse cx={x+1} cy={y+6} rx="9" ry="3" fill={green} opacity=".1"/><circle cx={x} cy={y} r="8" fill="url(#scene-ivory)" stroke={sage}/><circle cx={x} cy={y} r="5.5" fill="url(#scene-jade)"/></g>;
}
export function MovieMechanism(){return <Scene label="Across four turns, one trajectory advances to a goal while a second keeps returning to the same state. Both follow the same time axis.">
 {[58,179,300,420].map((x,i)=><g key={x}><path d={`M${x} 45V253`} stroke={line} strokeDasharray="2 7"/><text x={x} y="281" textAnchor="middle" fill={muted} fontSize="20">Turn {i+1}</text></g>)}
 <text x="20" y="36" fill={green} fontSize="20">Progress</text><text x="20" y="193" fill={rust} fontSize="20">Repetition</text>
 <path d="M58 149C134 174 168 122 240 116S350 102 420 84" stroke="#486e55" strokeWidth="8" opacity=".06" fill="none" strokeLinecap="round"/>
 <path d="M58 145C134 170 168 118 240 112S350 98 420 80" stroke="#d4e0cd" strokeWidth="8" fill="none" strokeLinecap="round"/>
 {[58,179,300,420].map((x,i)=><g key={x}><ellipse cx={x} cy={i===0?150:i===1?131:i===2?109:85} rx="13" ry="5" fill={green} opacity=".07"/><circle cx={x} cy={i===0?145:i===1?126:i===2?104:80} r="8" fill="url(#scene-ivory)" stroke={sage} strokeWidth="1.2"/></g>)}
 <Trace d="M58 145C134 170 168 118 240 112S350 98 420 80" start={.5} end={3.1}/>
 <Trace d="M58 220C98 182 138 258 179 220S259 182 300 220 380 258 420 220" start={.5} end={3.1} color={rust} width={2}/>
 {[58,179,300,420].map(x=><circle key={x} cx={x} cy="220" r="9" fill={paper} stroke={rust} strokeWidth="1.5"/>)}
 <JourneyDot/><Appear start={2.9}><Check x={420} y={80} r={13}/></Appear>
 </Scene>;}

function InitiativeJourney(){
 const p=usePhase(1.1,3.5),q=1-p;
 const x=q*q*q*58+3*q*q*p*195+3*q*p*p*340+p*p*p*416;
 const y=q*q*q*211+3*q*q*p*285+3*q*p*p*250+p*p*p*84;
 return <g><Trace d="M58 211C195 285 340 250 416 84" start={1.1} end={3.5}/><ellipse cx={x+2} cy={y+9} rx="12" ry="4" fill={green} opacity=".08"/><circle cx={x} cy={y} r="10" fill="url(#scene-ivory)" stroke={sage}/><path d={`m${x} ${y-6} 4 10-4-2-4 2Z`} fill="url(#scene-brass)" stroke="#a38349" strokeWidth=".7"/></g>;
}
export function AgencyMechanism(){return <Scene label="A direct route is blocked. An agent finds a useful alternative and follows it through to a verified goal.">
 <g stroke={line} strokeWidth=".8" fill="none" opacity=".45"><path d="M21 238C111 286 253 293 370 213S419 89 462 40M18 256C115 300 267 308 388 228S438 95 473 57M19 89q64-46 119-30m-88 62q59-35 104-23"/></g>
 <path d="M57 211Q107 87 187 68M57 211Q176 120 415 84M57 211C195 285 340 250 416 84" stroke={line} strokeWidth="1.5" fill="none" strokeDasharray="4 6"/>
 <path d="m234 61 13-8 12 7v132l-13 8-12-8Z" fill="#d9bb9c" stroke="#a9815c" strokeWidth=".8"/><path d="m247 53 12 7v132l-13 8V61Z" fill="#b99775"/><path d="m234 61 12 7 13-8m-25 29 12 7 13-8m-25 29 12 7 13-8m-25 29 12 7 13-8m-25 29 12 7 13-8" fill="none" stroke="#f3dfc0" strokeWidth=".8"/>
 <Trace d="M57 211Q147 157 244 137" start={.2} end={.9} color={rust} width={2}/>
 <Appear start={.75}><path d="m236 129 16 16m0-16-16 16" stroke={rust} strokeWidth="2.5" strokeLinecap="round"/></Appear>
 <circle cx="57" cy="211" r="12" fill={paper} stroke={green} strokeWidth="2"/><Flag x={416} y={66}/>
 <InitiativeJourney/>
 <text x="35" y="249" fill={muted} fontSize="20">Notice</text><text x="250" y="276" fill={muted} fontSize="20">Choose &amp; act</text>
 <Appear start={3.3}><Check x={416} y={84} r={13}/><text x="375" y="126" fill={green} fontSize="20">Verify</text></Appear>
 </Scene>;}

function MovingKey(){const p=usePhase(.7,2.1),x=236+141*p,y=185-75*Math.sin(p*Math.PI);return <g><ellipse cx={x} cy="246" rx={13+6*Math.sin(p*Math.PI)} ry="3" fill={green} opacity=".06"/><Key x={x} y={y} scale={.8}/></g>;}
function Drawer({x,y,scale=1}){return <g transform={`translate(${x} ${y}) scale(${scale})`}>
 <ellipse cx="5" cy="40" rx="47" ry="6" fill={green} opacity=".09"/>
 <path d="m-39-22 10-7h78l-10 7Z" fill="#fffdf1" stroke="#94a28c" strokeWidth="1"/><path d="m39-22 10-7v51l-10 7Z" fill="#9eb49a" stroke="#758c72" strokeWidth="1"/>
 <path d="M-39-22h78v51h-78Z" fill="url(#scene-ivory)" stroke="#748c70" strokeWidth="1.3"/>
 <path d="M-34-17h68V0h-68Zm0 23h68v18h-68Z" fill="#edf0df" stroke="#bcc9ad" strokeWidth=".8"/>
 <path d="M-9-8H9M-9 15H9" stroke="url(#scene-brass)" strokeWidth="3" strokeLinecap="round"/><path d="M-12-10v4m24-4v4M-12 13v4m24-4v4" stroke="#9f854e" strokeWidth="1"/>
 <path d="M-33 29v9h5l2-9m54 0 2 9h5v-9" fill="#668664" stroke="#526d51" strokeWidth=".8"/>
 </g>;}
function Bag({x,y}){return <g transform={`translate(${x} ${y})`}>
 <ellipse cx="3" cy="50" rx="39" ry="6" fill={green} opacity=".1"/>
 <path d="M-27-12h54l8 58h-70Z" fill="url(#scene-leather)" stroke="#a07f51" strokeWidth="1.2" strokeLinejoin="round"/>
 <path d="m24-10 11 56-11-5-4-52Z" fill="#8e734d" opacity=".4"/><path d="M-22-8h43l7 48h-56Z" stroke="#eddbb7" strokeWidth=".8" strokeDasharray="2 3" fill="none"/>
 <path d="M-14-10v-10a14 14 0 0 1 28 0v10" stroke="#aa8652" strokeWidth="5" fill="none"/><path d="M-14-10v-10a14 14 0 0 1 28 0v10" stroke="#dfc89b" strokeWidth="2" fill="none"/>
 <path d="M-28-12q28-8 56 0" fill="#736749" stroke="#ddc391" strokeWidth="1.4"/><path d="M-17-12v15m34-15V3" stroke="#a38050" strokeWidth="5"/>
 <path d="M-20-1h6v8h-6Zm34 0h6v8h-6Z" fill="url(#scene-brass)" stroke="#8a713d" strokeWidth=".7"/>
 </g>;}
export function MindMechanism(){return <Scene label="A key moves from a drawer to a bag while a person's thought still shows the key in the drawer. Belief and the physical world diverge.">
 <path d="M23 254 156 222 454 242 331 280Z" fill="#dce4d3" opacity=".3"/><path d="M26 255H452" stroke={line}/><Person x={78} y={207}/>
 <path d="M106 116c-29 14-66 3-66-22s22-35 51-33 48 13 48 35-13 29-33 20Z" fill={green} opacity=".035"/>
 <path d="M104 112c-29 14-66 3-66-22s22-35 51-33 48 13 48 35-13 29-33 20Z" fill="#fff" stroke={sage} strokeWidth="1.2"/>
 <circle cx="91" cy="130" r="4" fill="#fff" stroke={sage}/><circle cx="85" cy="143" r="2.3" fill={sage}/>
 <Drawer x={87} y={83} scale={.65}/><Key x={87} y={80} scale={.5}/>
 <Drawer x={236} y={205}/><Bag x={377} y={194}/><MovingKey/>
 <Trace d="M104 185Q141 166 195 190" start={2.1} end={3.1} width={1.5} color={sage} dashed/>
 <text x="78" y="35" textAnchor="middle" fill={muted} fontSize="20">Belief</text><text x="236" y="282" textAnchor="middle" fill={muted} fontSize="20">Drawer</text><text x="377" y="282" textAnchor="middle" fill={muted} fontSize="20">Bag</text>
 </Scene>;}

function SharedFields(){
 const p=usePhase(.5,2.4),left=149+33*p,right=331-33*p,shared=usePhase(2,3.2);
 return <g>
  <ellipse cx={left+3} cy="219" rx="57" ry="6" fill={green} opacity=".045"/><ellipse cx={right+3} cy="219" rx="57" ry="6" fill={gold} opacity=".06"/>
  <circle cx={left} cy="133" r="82" fill="url(#scene-glass-green)"/><circle cx={right} cy="133" r="82" fill="url(#scene-glass-amber)"/>
  <circle cx={left} cy="133" r="82" stroke={sage} strokeWidth="1.2" fill="none"/><circle cx={right} cy="133" r="82" stroke={gold} strokeWidth="1.2" fill="none"/>
  <path d={`M${left-64} 99a72 72 0 0 1 90-32M${right-64} 99a72 72 0 0 1 90-32`} stroke="#fffef3" strokeWidth="2" opacity=".8" fill="none" strokeLinecap="round"/>
  <path d={`M${left-21} 111  ${left-27} 153 ${left+34} 125Z`} stroke={sage} strokeWidth=".9" fill="none" opacity=".45"/>
  <path d={`M${right+20} 112 ${right+30} 158 ${right-35} 143Z`} stroke={gold} strokeWidth=".9" fill="none" opacity=".5"/>
  <circle cx={left-21} cy="111" r="7" fill={sage}/><path d={`m${left-35} 160 8-14 8 14Z`} fill={green} opacity=".7"/>
  <path d={`m${right+20} 103 9 9-9 9-9-9Z`} fill={gold}/><circle cx={right+30} cy="158" r="6" fill={gold}/>
  <circle cx={left+34+(240-left-34)*shared} cy={125} r="6" fill={green}/><circle cx={right-35+(240-right+35)*shared} cy={143} r="6" fill={gold}/>
  <g opacity={shared}><circle cx="240" cy="134" r="29" fill="#fff9e2" opacity=".5"/><path d="m240 113 18 10v22l-18 10-18-10v-22Z" fill="url(#scene-jade)" stroke="#5c805d" strokeWidth=".8"/><path d="m240 113 18 10-18 11-18-11Z" fill="#dce9c7"/><path d="M240 134v21l18-10v-22Z" fill="#52785b"/><path d="m222 123 18 11 18-11m-18 11v21" fill="none" stroke="#f3e7b4" strokeWidth="1"/></g>
 </g>;
}
export function GroundingMechanism(){return <Scene label="Two participants exchange evidence. Their knowledge fields overlap and a shared understanding is confirmed in the centre.">
 <SharedFields/><Person x={65} y={229}/><Person x={415} y={229} flip/>
 <Trace d="M90 206Q148 245 211 163" start={.6} end={1.8} color={sage} width={1.8}/><Trace d="M390 206Q335 244 269 163" start={1.2} end={2.5} color={gold} width={1.8}/>
 <text x="65" y="288" textAnchor="middle" fill={muted} fontSize="20">A</text><text x="415" y="288" textAnchor="middle" fill={muted} fontSize="20">B</text>
 <Appear start={2.7}><text x="240" y="262" textAnchor="middle" fill={green} fontSize="20">Shared understanding</text></Appear>
 </Scene>;}

function Reroute(){
 const p=usePhase(1.6,3.5),q=1-p;
 const x=q*q*q*62+3*q*q*p*170+3*q*p*p*327+p*p*p*419;
 const y=q*q*q*205+3*q*q*p*281+3*q*p*p*247+p*p*p*74;
 const dx=3*q*q*(170-62)+6*q*p*(327-170)+3*p*p*(419-327),dy=3*q*q*(281-205)+6*q*p*(247-281)+3*p*p*(74-247),angle=Math.atan2(dy,dx)*180/Math.PI;
 return <g><Trace d="M62 205C170 281 327 247 419 74" start={1.6} end={3.5}/><ellipse cx={x+2} cy={y+6} rx="12" ry="4" fill={green} opacity=".1"/><g transform={`translate(${x} ${y}) rotate(${angle})`}><rect x="-14" y="-7" width="28" height="14" rx="5" fill="url(#scene-ivory)" stroke={green} strokeWidth="1.4"/><path d="M-9-3h14v6H-9Z" fill="#799e86"/><path d="M-5-3v6m5-6v6" stroke="#e8edda" strokeWidth=".8"/><path d="M9-3v6" stroke={gold} strokeWidth="2" strokeLinecap="round"/></g></g>;
}
function Station({x,y,terminal=false}){return <g transform={`translate(${x} ${y})`}>
 <ellipse cy="9" rx="26" ry="7" fill={green} opacity=".07"/>
 <path d="m-23 3 12-8 35 3-11 9Z" fill="#d4ddca"/>
 <path d="M-17-29h30V2h-30Z" fill="url(#scene-ivory)" stroke="#91a185" strokeWidth=".9"/>
 <path d="m13-29 8-5V-3l-8 5Z" fill="#a0b79a" stroke="#8a9f81" strokeWidth=".8"/>
 <path d="m-22-28 20-14 20 12 8-5-20-13-28 15Z" fill="url(#scene-jade)" stroke="#66845f" strokeWidth="1"/>
 <path d="M-4-14h9V2h-9Z" fill="#66836a"/><path d="M-13-20h5v6h-5Zm18 0h5v6H5Z" fill="#c6d6b9" stroke="#9bac8c" strokeWidth=".6"/>
 {terminal&&<g><circle cx="-1" cy="-30" r="7" fill="#fff9dd" stroke={gold} strokeWidth="1.2"/><path d="M-1-35v5l3 2" fill="none" stroke={green} strokeWidth="1"/></g>}
 </g>;}
function Attention(){const p=usePhase(.2,1.4);return <g><circle cx="230" cy="111" r={15+p*36} fill="none" stroke={rust} strokeWidth="1" opacity={1-p}/><circle cx="230" cy="111" r="13" fill="#f2e4d8" stroke={rust}/><path d="m225 106 10 10m0-10-10 10" stroke={rust} strokeWidth="2" strokeLinecap="round"/></g>;}
export function AwarenessMechanism(){return <Scene label="A train connection is cancelled. Attention shifts to the disruption; the expected route fades and an alternative route is projected and followed.">
 <defs><pattern id="transit-grid" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".8" fill={line}/></pattern></defs>
 <path d="M16 24H464V254H16Z" fill="url(#transit-grid)" opacity=".5"/>
 <path d="M62 205 230 111 419 74M230 111 261 212 419 74M62 205C170 281 327 247 419 74" stroke="#b7c8ad" strokeWidth="7" fill="none" strokeLinecap="round" opacity=".5"/>
 <path d="M62 205 230 111 419 74M230 111 261 212 419 74M62 205C170 281 327 247 419 74" stroke="#fbfbf1" strokeWidth="3.5" fill="none"/>
 <path d="M230 111 419 74" stroke={rust} opacity=".5" strokeWidth="2" strokeDasharray="5 7"/>
 <circle cx="62" cy="205" r="10" fill={paper} stroke={green} strokeWidth="2"/><circle cx="261" cy="212" r="7" fill={paper} stroke={sage} strokeWidth="2"/>
 <Station x={62} y={195}/><Station x={419} y={65} terminal/>
 <Attention/><Reroute/>
 <text x="211" y="79" fill={rust} fontSize="20">Cancelled</text>
 <text x="34" y="240" fill={muted} fontSize="20">Now</text><text x="380" y="115" fill={muted} fontSize="20">9 a.m.</text>
 <g fill={muted} fontSize="20"><text x="24" y="290">Notice</text><text x="178" y="290">Understand</text><text x="359" y="290">Anticipate</text></g>
 <Trace d="M24 267H450" start={.3} end={3.5} width={1.5}/>
 </Scene>;}
