import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {IcebergMechanism,MovieMechanism,AgencyMechanism,InformationMechanism,PartnerMechanism,ArchitectureMechanism} from './Mechanisms.jsx';

const paper=__PAPER__;
const ink='#234e3b', rust='#a05b35', blue='#687994', muted='#52645b', line='#cbd5cb';
const colors=[ink,rust,blue];
const ease=Easing.bezier(.22,.8,.24,1);
const clamped={extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:ease};
const fmt=n=>n.toFixed(3);

function Trace({values,index}){
  const frame=useCurrentFrame(),{fps}=useVideoConfig();
  const x=[72,240,408],y=v=>238-(v-.35)/.35*180;
  const d=values.map((v,i)=>`${i?'L':'M'} ${x[i]} ${y(v)}`).join(' ');
  return <g>
    <path d={d} stroke={colors[index]} fill="none" strokeWidth="2.5" pathLength={1} strokeDasharray={1}
      strokeDashoffset={interpolate(frame,[(.3+index*.16)*fps,(1.8+index*.16)*fps],[1,0],clamped)}/>
    {values.map((v,i)=><g key={i} opacity={interpolate(frame,[(.3+index*.16+i*.5)*fps,(.65+index*.16+i*.5)*fps],[0,1],clamped)}>
      <circle cx={x[i]} cy={y(v)} r="5" fill="var(--paper,#f7f8f3)" stroke={colors[index]} strokeWidth="2.5"/>
      <text x={x[i]} y={y(v)-12} textAnchor="middle" fontSize="21" fill={colors[index]}>{fmt(v)}</text>
    </g>)}
  </g>;
}

export function InformationChart(){
  return <AbsoluteFill style={{fontFamily:'"DM Sans",Sans,Arial,sans-serif',color:ink}}>
    <svg viewBox="0 0 480 340" role="img" aria-label="Three models score lower with partial information than with insufficient information">
      <text x="5" y="23" fontSize="21" fill={muted}>Matched scenarios · score (0–1)</text>
      <PartialBand/>
      {[.4,.5,.6,.7].map(v=><g key={v}>
        <path d={`M42 ${238-(v-.35)/.35*180} H453`} stroke={line} strokeDasharray="3 5"/>
        <text x="5" y={242-(v-.35)/.35*180} fontSize="21" fill={muted}>{v.toFixed(1)}</text>
      </g>)}
      {paper.matched_information.map((m,i)=><Trace key={m.name} values={m.conditions} index={i}/>)}
      {['Sufficient','Partial','Insufficient'].map((label,i)=><text key={label} x={[72,240,408][i]} y="271" textAnchor="middle" fontSize="21" fill={ink}>{label}</text>)}
      <g fontSize="21" fill={muted}>
        <circle cx="15" cy="300" r="4" fill={ink}/><text x="27" y="305">gpt-6-astra</text>
        <circle cx="245" cy="300" r="4" fill={rust}/><text x="257" y="305">gpt-5.6-sol</text>
        <circle cx="15" cy="327" r="4" fill={blue}/><text x="27" y="332">gemini-3.8-flash</text>
      </g>
    </svg>
  </AbsoluteFill>;
}

function PartialBand(){
  const frame=useCurrentFrame(),{fps}=useVideoConfig();
  return <rect x="203" y="42" width="74" height="203" rx="8" fill="#a05b35"
    opacity={interpolate(frame,[1.6*fps,2.6*fps],[0,.065],clamped)}/>;
}

function StageRange({index,label,level}){
  const frame=useCurrentFrame(),{fps}=useVideoConfig();
  const vals=paper.models.map(m=>m.stages[index]),lo=Math.min(...vals),hi=Math.max(...vals);
  const mid=(lo+hi)/2,y=76+index*85;
  const start=.25+index*.55,end=1.35+index*.55;
  const left=interpolate(frame,[start*fps,end*fps],[mid,lo],clamped);
  const right=interpolate(frame,[start*fps,end*fps],[mid,hi],clamped);
  return <g>
    <text x="6" y={y-12} fill={ink} fontSize="21">{label}</text>
    <text x="6" y={y+11} fill={muted} fontSize="21">{level}</text>
    <path d={`M155 ${y}H388`} stroke={line} strokeWidth="2"/>
    <path d={`M${155+left*233} ${y}H${155+right*233}`} stroke={index===2?rust:ink} strokeWidth="12" strokeLinecap="round"/>
    {[left,right].map((v,i)=><path key={i} d={`M${155+v*233} ${y-9}v18`} stroke={index===2?rust:ink} strokeWidth="3"/>)}
    <text x="475" y={y+7} textAnchor="end" fontSize="24" fill={index===2?rust:ink}>{fmt(hi-lo)}</text>
  </g>;
}

export function InitiativeChart(){
  return <AbsoluteFill style={{fontFamily:'"DM Sans",Sans,Arial,sans-serif'}}>
    <svg viewBox="0 0 480 340" role="img" aria-label="The score range grows from 0.035 in passive execution to 0.370 in active adaptation">
      <text x="6" y="23" fontSize="21" fill={muted}>Model score ranges</text>
      <text x="475" y="23" fontSize="21" fill={muted} textAnchor="end">Gap</text>
      <StageRange index={0} label="Follow" level="L1–L2"/>
      <StageRange index={1} label="Adapt" level="L3–L4"/>
      <StageRange index={2} label="Lead & sustain" level="L5–L6"/>
      {[0,.5,1].map(v=><text key={v} x={155+v*233} y="282" textAnchor="middle" fontSize="21" fill={muted}>{v}</text>)}
      <text x="6" y="325" fontSize="21" fill={muted}>Same 0–1 scale across all three stages</text>
    </svg>
  </AbsoluteFill>;
}

function ArchitecturePair({index,name,values}){
  const frame=useCurrentFrame(),{fps}=useVideoConfig(),y=90+index*79;
  return <g>
    <text x="6" y={y+10} fontSize="21" fill={ink}>{name}</text>
    {values.map((v,i)=><g key={i}>
      <rect x="132" y={y-10+i*22} width="262" height="13" rx="2" fill="#e3e9dd"/>
      <rect x="132" y={y-10+i*22} height="13" rx="2" fill={i?rust:ink} width={v/.07*262}
        style={{transformBox:'fill-box',transformOrigin:'left center',transform:`scaleX(${interpolate(frame,[(.3+index*.25+i*.18)*fps,(1.5+index*.25+i*.18)*fps],[0,1],clamped)})`}}/>
      <text x="475" y={y+2+i*22} fontSize="21" fill={i?rust:ink} textAnchor="end">+{fmt(v)}</text>
    </g>)}
  </g>;
}

export function ArchitectureChart(){
  return <AbsoluteFill style={{fontFamily:'"DM Sans",Sans,Arial,sans-serif'}}>
    <svg viewBox="0 0 480 340" role="img" aria-label="MetaMind gains most in open-ended interactions; Cognizer and Claude Code in task-oriented interactions">
      <rect x="6" y="15" width="12" height="12" rx="2" fill={ink}/><text x="27" y="27" fontSize="21" fill={ink}>Task-oriented</text>
      <rect x="230" y="15" width="12" height="12" rx="2" fill={rust}/><text x="251" y="27" fontSize="21" fill={ink}>Open-ended</text>
      <ArchitecturePair index={0} name="MetaMind" values={[.021,.046]}/>
      <ArchitecturePair index={1} name="Cognizer" values={[.061,.032]}/>
      <ArchitecturePair index={2} name="Claude Code" values={[.062,.019]}/>
      <text x="6" y="327" fontSize="21" fill={muted}>Mean gain over the same ten base models</text>
    </svg>
  </AbsoluteFill>;
}

function PartnerLink({index,x,y,row}){
  const frame=useCurrentFrame(),{fps}=useVideoConfig();
  const p=interpolate(frame,[(.25+index*.3)*fps,(1.35+index*.3)*fps],[0,1],clamped);
  return <g>
    <path d={`M240 150L${x} ${y}`} stroke={line} strokeWidth="2"/>
    <path d={`M240 150L${x} ${y}`} stroke={ink} strokeWidth="2" pathLength="1" strokeDasharray="1" strokeDashoffset={1-p}/>
    <circle cx={240+(x-240)*p} cy={150+(y-150)*p} r="4" fill={ink} opacity={p<1?1:0}/>
    <circle cx={x} cy={y} r="22" fill="#e5ecdf" stroke={ink} strokeWidth="1.5"/>
    <text x={x} y={y+5} textAnchor="middle" fill={ink} fontSize="21">{['Cl','GPT','Qw','GLM'][index]}</text>
    <text x={x} y={y+44} textAnchor="middle" fill={ink} fontSize="21">{fmt(paper.interaction_matrix[row].scores[0])}</text>
  </g>;
}

export function PartnerChart(){
  return <AbsoluteFill style={{fontFamily:'"DM Sans",Sans,Arial,sans-serif'}}>
    <svg viewBox="0 0 480 340" role="img" aria-label="Claude Opus 5.5 receives different scores with four different partners">
      <text x="6" y="23" fill={muted} fontSize="21">One assistant, different partners</text>
      <PartnerLink index={0} x={75} y={80} row={0}/>
      <PartnerLink index={1} x={405} y={80} row={1}/>
      <PartnerLink index={2} x={75} y={215} row={5}/>
      <PartnerLink index={3} x={405} y={215} row={9}/>
      <circle cx="240" cy="150" r="43" fill={ink}/>
      <text x="240" y="144" textAnchor="middle" fill="#f7f8f3" fontSize="21">Claude</text>
      <text x="240" y="165" textAnchor="middle" fill="#f7f8f3" fontSize="21">Opus 5.5</text>
      <text x="6" y="312" fontSize="21" fill={muted}>Partners: Claude Opus 5.5, gpt-6-astra,</text>
      <text x="6" y="333" fontSize="21" fill={muted}>qwen3.8-max and glm-5.3-flash.</text>
    </svg>
  </AbsoluteFill>;
}

function ProbeBar({value,index,label}){
  const frame=useCurrentFrame(),{fps}=useVideoConfig(),x=130+index*195;
  return <g>
    <rect x={x} y="70" width="80" height="190" rx="3" fill="#edf2ec"/>
    <rect x={x} width="80" rx="3" fill={index?rust:ink} y={260-value*1.9} height={value*1.9}
      style={{transformBox:'fill-box',transformOrigin:'center bottom',transform:`scaleY(${interpolate(frame,[(.25+index*.4)*fps,(1.5+index*.4)*fps],[0,1],clamped)})`}}/>
    <text x={x+40} y={246-value*1.9} textAnchor="middle" fill={index?rust:ink} fontSize="25">{value}%</text>
    <text x={x+40} y="294" textAnchor="middle" fontSize="21" fill={ink}>{label[0]}</text>
    <text x={x+40} y="320" textAnchor="middle" fontSize="21" fill={muted}>{label[1]}</text>
  </g>;
}
function ProbeChart({kind}){
 const state=kind==='state';
 // Table 33, paired-probe separation rates. These are not human accuracy estimates.
 return <AbsoluteFill style={{fontFamily:'"DM Sans",Sans,Arial,sans-serif'}}><svg viewBox="0 0 480 340" role="img" aria-label={state?'State-probe separation: 91% with latent state, 68% without':'Recurrence-probe separation: 89% with the event chain, 57% without'}>
   <text x="6" y="24" fontSize="21" fill={muted}>Probe pairs correctly separated</text>
   {[0,50,100].map(v=><g key={v}><path d={`M68 ${260-v*1.9}H465`} stroke={line} strokeDasharray="3 5"/><text x="6" y={267-v*1.9} fontSize="21" fill={muted}>{v}%</text></g>)}
   <ProbeBar value={state?91:89} index={0} label={['Full','framework']}/>
   <ProbeBar value={state?68:57} index={1} label={['Without',state?'latent state':'event chain']}/>
 </svg></AbsoluteFill>;
}
export const StateProbeChart=()=> <ProbeChart kind="state"/>;
export const TrajectoryProbeChart=()=> <ProbeChart kind="trajectory"/>;
export const charts={'information-mechanism':InformationMechanism,'partner-mechanism':PartnerMechanism,'architecture-mechanism':ArchitectureMechanism,'iceberg-mechanism':IcebergMechanism,'movie-mechanism':MovieMechanism,'agency-mechanism':AgencyMechanism,state:StateProbeChart,trajectory:TrajectoryProbeChart,information:InformationChart,initiative:InitiativeChart,architecture:ArchitectureChart,partner:PartnerChart};
