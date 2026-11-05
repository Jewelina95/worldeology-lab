import React from 'react';
import {AbsoluteFill,Easing,interpolate,useCurrentFrame,useVideoConfig} from 'remotion';

const ink='#234e3b',muted='#607266',line='#cbd5cb',rust='#a05b35',soft='#edf2e9';
const timing={extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.bezier(.22,.8,.24,1)};
const base={fontFamily:'"DM Sans",Sans,Arial,sans-serif',color:ink};

function DrawPath({d,start=0,end=1,color=ink,width=2.5}){
 const frame=useCurrentFrame(),{fps}=useVideoConfig();
 return <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset={interpolate(frame,[start*fps,end*fps],[1,0],timing)}/>;
}
function Reveal({start=0,children}){
 const frame=useCurrentFrame(),{fps}=useVideoConfig();
 return <g opacity={interpolate(frame,[start*fps,(start+.35)*fps],[0,1],timing)}>{children}</g>;
}
function Step({x,y,w=120,h=50,lines,start,highlight=false,tone=ink}){
 const frame=useCurrentFrame(),{fps}=useVideoConfig();
 const progress=interpolate(frame,[start*fps,(start+.4)*fps],[0,1],timing);
 return <g>
  <rect x={x} y={y} width={w} height={h} rx="7" fill={soft} stroke={line}/>
  {highlight&&<rect x={x} y={y} width={w} height={h} rx="7" fill={tone} opacity={progress}/>}
  <g opacity={.3+.7*progress} fill={highlight&&progress>.5?'#fff':ink} fontSize="21" textAnchor="middle">
   {lines.map((text,i)=><text key={i} x={x+w/2} y={y+h/2+(i-(lines.length-1)/2)*23+7}>{text}</text>)}
  </g>
 </g>;
}

function IcebergStates(){
 const frame=useCurrentFrame(),{fps}=useVideoConfig();
 const update=interpolate(frame,[2.6*fps,3.2*fps],[0,1],timing);
 return <g>
  <g><rect x="39" y="143" width="165" height="43" rx="7" fill="#fff" stroke={line}/><text x="121.5" y="171" fontSize="21" textAnchor="middle" fill={muted}>Understands?</text><path d="M49 164H194" stroke={rust} strokeWidth="2" opacity={update}/></g>
  <rect x="273" y="143" width="174" height="43" rx="7" fill={soft} stroke={update>.5?rust:line} strokeWidth={update>.5?2.5:1}/>
  <text x="360" y="171" textAnchor="middle" fontSize="21" fill={update>.5?rust:muted}>{update>.5?'Misconception':'Confused?'}</text>
  <DrawPath d="M240 83V119M240 119L121 143M240 119L360 143" start={.2} end={1.2} color={muted} width={1.8}/>
  <Reveal start={1.5}><rect x="22" y="224" width="272" height="63" rx="8" fill="#fff" stroke={line}/><text x="158" y="250" fontSize="21" fill={ink} textAnchor="middle">Which is larger?</text><text x="158" y="275" fontSize="21" fill={ink} textAnchor="middle">1/3 or 1/4?</text></Reveal>
  <DrawPath d="M297 255H330m-7-6 7 6-7 6" start={2} end={2.35} color={muted}/>
  <Reveal start={2.3}><rect x="337" y="232" width="110" height="49" rx="8" fill="#f3e9e0"/><text x="392" y="263" fontSize="24" fill={rust} textAnchor="middle">1/4</text></Reveal>
  <DrawPath d="M391 229V202L368 188m0 0-1 9m1-9 9 3" start={2.7} end={3.4} color={rust}/>
 </g>;
}
export function IcebergMechanism(){
 return <AbsoluteFill style={base}><svg viewBox="0 0 480 300" role="img" aria-label="The same visible reply can support different state hypotheses. A fraction question reveals a misconception.">
  <path d="m135 110 105-95 100 95 48 13-36 74-115 17-104-25-36-56Z" fill="#dfe9dd"/>
  <path d="m135 110 105-95 100 95M97 123l36 56 104 25 115-17 36-64" stroke="#8ca990" strokeWidth="1.5" fill="none"/>
  <text x="10" y="31" fontSize="21" fill={muted}>Observed</text>
  <rect x="122" y="37" width="287" height="47" rx="9" fill="#fff" stroke={ink} strokeWidth="1.7"/>
  <text x="265.5" y="68" fontSize="23" fill={ink} textAnchor="middle">“Yes, I understand.”</text>
  <path d="M12 111c46-8 65 7 110 0s65 7 110 0 64 7 108 0 69 7 127 0" stroke="#8ca990" strokeWidth="2" fill="none"/>
  <text x="10" y="135" fontSize="21" fill={muted}>Possible states</text>
  <IcebergStates/>
 </svg></AbsoluteFill>;
}

export function MovieMechanism(){
 return <AbsoluteFill style={base}><svg viewBox="0 0 480 300" role="img" aria-label="Across three turns, proposing, acting and verifying form progress; proposing repeatedly is recurrence.">
  {[85,240,395].map((x,i)=><g key={x}><text x={x} y="25" textAnchor="middle" fontSize="21" fill={muted}>Turn {i+1}</text><path d={`M${x} 37V280`} stroke={line} strokeDasharray="3 6"/></g>)}
  <text x="12" y="66" fontSize="21" fill={ink}>Progress</text>
  <Step x={25} y={78} lines={['Propose']} start={.2}/>
  <DrawPath d="M148 103h29m-7-6 7 6-7 6" start={.6} end={1}/>
  <Step x={180} y={78} lines={['Act']} start={1}/>
  <DrawPath d="M303 103h29m-7-6 7 6-7 6" start={1.4} end={1.8}/>
  <Step x={335} y={78} lines={['Verify']} start={1.8} highlight/>
  <text x="12" y="190" fontSize="21" fill={rust}>Recurrence</text>
  <Step x={25} y={202} lines={['Propose']} start={.2}/>
  <DrawPath d="M148 227h29m-7-6 7 6-7 6" start={.6} end={1} color={rust}/>
  <Step x={180} y={202} lines={['Propose']} start={1}/>
  <DrawPath d="M303 227h29m-7-6 7 6-7 6" start={1.4} end={1.8} color={rust}/>
  <Step x={335} y={202} lines={['Propose']} start={1.8} highlight tone={rust}/>
  <DrawPath d="M420 256c0 31-65 31-65 0m-5 8 5-8 7 6" start={2.3} end={3.2} color={rust}/>
 </svg></AbsoluteFill>;
}

export function AgencyMechanism(){
 return <AbsoluteFill style={base}><svg viewBox="0 0 480 300" role="img" aria-label="A release-review example contrasts acknowledging that tests passed with checking coverage, testing an upgrade, and verifying the fix.">
  <rect x="112" y="5" width="292" height="46" rx="9" fill="#fff" stroke={ink} strokeWidth="1.7"/>
  <text x="258" y="35" textAnchor="middle" fontSize="23" fill={ink}>“All tests passed.”</text>
  <text x="12" y="86" fontSize="21" fill={muted}>Response</text>
  <Step x={12} y={98} w={205} lines={['Acknowledge']} start={.2}/>
  <DrawPath d="M222 122h67m-7-6 7 6-7 6" start={.6} end={1.1} color={muted}/>
  <Step x={295} y={98} w={174} lines={['Wait']} start={1.1}/>
  <text x="12" y="192" fontSize="21" fill={ink}>Initiative</text>
  <Step x={12} y={204} w={132} h={66} lines={['Check','coverage']} start={.6}/>
  <DrawPath d="M149 237h21m-7-6 7 6-7 6" start={1} end={1.4}/>
  <Step x={175} y={204} w={132} h={66} lines={['Test','upgrade']} start={1.4}/>
  <DrawPath d="M312 237h21m-7-6 7 6-7 6" start={1.8} end={2.2}/>
  <Step x={338} y={204} w={132} h={66} lines={['Verify','fix']} start={2.2} highlight/>
 </svg></AbsoluteFill>;
}


export function InformationMechanism(){
 return <AbsoluteFill style={base}><svg viewBox="0 0 480 300" role="img" aria-label="Incomplete evidence can invite assumptions; a known gap invites a question.">
  <text x="12" y="28" fontSize="21" fill={muted}>Two ways information can be missing</text>
  <Step x={12} y={57} w={180} h={66} lines={['Partial picture']} start={.2}/>
  <DrawPath d="M200 90h65m-7-6 7 6-7 6" start={.6} end={1.2} color={rust}/>
  <Step x={276} y={57} w={192} h={66} lines={['Fill in the gaps?']} start={1.2} tone={rust} highlight/>
  <Step x={12} y={176} w={180} h={66} lines={['Explicit gap']} start={.2}/>
  <DrawPath d="M200 209h65m-7-6 7 6-7 6" start={.6} end={1.2}/>
  <Step x={276} y={176} w={192} h={66} lines={['Ask for evidence']} start={1.2} highlight/>
  <text x="12" y="282" fontSize="19" fill={muted}>Conceptual reading of the matched comparison</text>
 </svg></AbsoluteFill>;
}
export function PartnerMechanism(){
 return <AbsoluteFill style={base}><svg viewBox="0 0 480 300" role="img" aria-label="A partner's question changes the evidence available to the same assistant.">
  <text x="12" y="28" fontSize="21" fill={muted}>The partner shapes the next turn</text>
  <Step x={12} y={62} w={175} h={62} lines={['Partner asks']} start={.2}/>
  <DrawPath d="M195 93h80m-7-6 7 6-7 6" start={.6} end={1.3}/>
  <Step x={285} y={62} w={183} h={62} lines={['New evidence']} start={1.3}/>
  <DrawPath d="M376 130v50m-6-7 6 7 6-7" start={1.7} end={2.3}/>
  <Step x={285} y={189} w={183} h={62} lines={['Assistant acts']} start={2.3} highlight/>
  <DrawPath d="M277 221H100V132m-6 7 6-7 6 7" start={2.6} end={3.6} color={rust}/>
  <text x="12" y="285" fontSize="19" fill={muted}>Same assistant, a different course of interaction</text>
 </svg></AbsoluteFill>;
}
export function ArchitectureMechanism(){
 return <AbsoluteFill style={base}><svg viewBox="0 0 480 300" role="img" aria-label="Architectures add different supports to the same base model; gains depend on interaction purpose.">
  <text x="12" y="28" fontSize="21" fill={muted}>Same base, different support</text>
  <Step x={12} y={106} w={140} h={66} lines={['Base model']} start={.2}/>
  <DrawPath d="M157 139h40V80h38m-7-6 7 6-7 6M197 139v67h38m-7-6 7 6-7 6" start={.6} end={1.6}/>
  <Step x={245} y={48} w={220} h={66} lines={['Task support']} start={1.6} highlight/>
  <Step x={245} y={174} w={220} h={66} lines={['Relational support']} start={1.6} highlight tone={rust}/>
  <text x="12" y="285" fontSize="19" fill={muted}>Compare gains within each interaction purpose</text>
 </svg></AbsoluteFill>;
}


// Psychological lenses; diagrams are authored illustrations, not observed episodes.
export function MindMechanism(){
 return <AbsoluteFill style={base}><svg viewBox="0 0 480 300" role="img" aria-label="A key has moved to a bag, but a person still believes it is in a drawer. A useful response accounts for that belief.">
  <text x="12" y="28" fontSize="21" fill={muted}>Different views of the same situation</text>
  <Step x={12} y={55} w={210} h={76} lines={['World','Key in the bag']} start={.2}/>
  <Step x={258} y={55} w={210} h={76} lines={['Belief','Key in the drawer']} start={.8} tone={rust} highlight/>
  <DrawPath d="M117 139v28h123m123-28v28H240v28m-6-7 6 7 6-7" start={1.2} end={2.2}/>
  <Step x={116} y={204} w={248} h={62} lines={['Explain where it moved']} start={2.2} highlight/>
  <text x="12" y="294" fontSize="18" fill={muted}>Act on what the person knows and believes</text>
 </svg></AbsoluteFill>;
}
export function GroundingMechanism(){
 return <AbsoluteFill style={base}><svg viewBox="0 0 480 300" role="img" aria-label="Two participants build common ground by proposing, checking and confirming understanding.">
  <text x="12" y="28" fontSize="21" fill={muted}>Understanding becomes shared</text>
  <circle cx="186" cy="115" r="69" fill={ink} opacity=".12"/>
  <circle cx="294" cy="115" r="69" fill={rust} opacity=".12"/>
  <text x="151" y="121" fontSize="21" textAnchor="middle" fill={ink}>A knows</text>
  <text x="330" y="121" fontSize="21" textAnchor="middle" fill={rust}>B knows</text>
  <Reveal start={2.2}><path d="m225 115 11 11 21-25" fill="none" stroke={ink} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/></Reveal>
  <Step x={12} y={218} w={132} h={56} lines={['Propose']} start={.2}/>
  <DrawPath d="M150 246h20m-7-6 7 6-7 6" start={.6} end={1}/>
  <Step x={175} y={218} w={132} h={56} lines={['Check']} start={1}/>
  <DrawPath d="M313 246h20m-7-6 7 6-7 6" start={1.4} end={1.8}/>
  <Step x={338} y={218} w={132} h={56} lines={['Confirm']} start={2.2} highlight/>
 </svg></AbsoluteFill>;
}
export function AwarenessMechanism(){
 return <AbsoluteFill style={base}><svg viewBox="0 0 480 300" role="img" aria-label="Perceive a cancelled train, understand the connection is at risk, and anticipate the need for another route.">
  {['Perceive','Understand','Anticipate'].map((label,i)=><text key={label} x={78+i*163} y="43" textAnchor="middle" fontSize="21" fill={muted}>{label}</text>)}
  <Step x={12} y={80} w={132} h={92} lines={['Train','cancelled']} start={.2}/>
  <DrawPath d="M150 126h20m-7-6 7 6-7 6" start={.7} end={1.1}/>
  <Step x={175} y={80} w={132} h={92} lines={['Connection','at risk']} start={1.1}/>
  <DrawPath d="M313 126h20m-7-6 7 6-7 6" start={1.6} end={2}/>
  <Step x={338} y={80} w={132} h={92} lines={['Find another','route']} start={2} highlight/>
  <DrawPath d="M78 194v25h326v-25" start={2.4} end={3.2} color={muted} width={1.5}/>
  <Reveal start={2.7}><text x="240" y="262" textAnchor="middle" fontSize="21" fill={ink}>Goal: arrive before 9 a.m.</text></Reveal>
 </svg></AbsoluteFill>;
}
