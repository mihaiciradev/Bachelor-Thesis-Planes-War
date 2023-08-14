
function GameMenuButton(props){
    return <>
        <div className="game-menu-button" id={props.icon}>
            <h3>{props.title}</h3>
            <button onClick={()=>{props.event()}}>
                {
                    props.icon==="menu-plane-1" &&
                        <>
                    <svg viewBox="0 0 143 143" fill="none">
                        <circle cx="71.5" cy="71.5" r="66" fill="#10FFE2" stroke="#278EA5" strokeWidth="11"/>
                        <path d="M65.9909 50.5H76.1742V60.6834H65.9909V50.5Z" fill="#FF800B" stroke="#10FFE2"/>
                        <path d="M65.9909 61.6841H76.1742V71.8674H65.9909V61.6841Z" fill="#FF800B" stroke="#10FFE2"/>
                        <path d="M77.1742 61.6841H87.3576V71.8674H77.1742V61.6841Z" fill="#FF800B" stroke="#10FFE2"/>
                        <path d="M88.2333 61.6841H98.4167V71.8674H88.2333V61.6841Z" fill="#FF800B" stroke="#10FFE2"/>
                        <path d="M54.8075 61.6841H64.9909V71.8674H54.8075V61.6841Z" fill="#FF800B" stroke="#10FFE2"/>
                        <path d="M43.4999 61.6841H53.6833V71.8674H43.4999V61.6841Z" fill="#FF800B" stroke="#10FFE2"/>
                        <path d="M65.9909 72.8672H76.1742V83.0505H65.9909V72.8672Z" fill="#FF800B" stroke="#10FFE2"/>
                        <path d="M65.8666 84.0503H76.0499V94.2337H65.8666V84.0503Z" fill="#FF800B" stroke="#10FFE2"/>
                        <path d="M77.1742 84.0503H87.3576V94.2337H77.1742V84.0503Z" fill="#FF800B" stroke="#10FFE2"/>
                        <path d="M54.6832 84.0503H64.8666V94.2337H54.6832V84.0503Z" fill="#FF800B" stroke="#10FFE2"/>
                    </svg>
                            <svg width="94" height="119" viewBox="0 0 94 119" fill="none" xmlns="http://www.w3.org/2000/svg"> <g filter="url(#filter0_d)"> <path d="M7.5 58.9999L32.5 98.9999C42.8333 62.1665 68.3 -7.60012 87.5 7.99988" stroke="#38AD67" strokeWidth="10"/> </g> <defs> <filter id="filter0_d" x="0.26001" y="0.76123" width="93.393" height="117.485" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"> <feFlood floodOpacity="0" result="BackgroundImageFix"/> <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/> <feOffset dy="4"/> <feGaussianBlur stdDeviation="1.5"/> <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"/> <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/> <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/> </filter> </defs> </svg>
                    </>
                }
                {
                    props.icon==="menu-plane-2" &&
                        <>
                    <svg viewBox="0 0 143 143" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="71.5" cy="71.5" r="66" fill="#10FFE2" stroke="#278EA5" strokeWidth="11"/>
                    <path d="M66.0734 44.5H76.8874V55.314H66.0734V44.5Z" fill="#FF800B" stroke="#10FFE2"/>
                    <path d="M66.2046 56.3135H77.0187V67.1275H66.2046V56.3135Z" fill="#FF800B" stroke="#10FFE2"/>
                    <path d="M77.8874 56.3135H88.7014V67.1275H77.8874V56.3135Z" fill="#FF800B" stroke="#10FFE2"/>
                    <path d="M89.7014 56.3135H100.515V67.1275H89.7014V56.3135Z" fill="#FF800B" stroke="#10FFE2"/>
                    <path d="M101.515 56.3135H112.329V67.1275H101.515V56.3135Z" fill="#FF800B" stroke="#10FFE2"/>
                    <path d="M54.3906 56.3135H65.2046V67.1275H54.3906V56.3135Z" fill="#FF800B" stroke="#10FFE2"/>
                    <path d="M42.4453 56.3135H53.2593V67.1275H42.4453V56.3135Z" fill="#FF800B" stroke="#10FFE2"/>
                    <path d="M30.5 56.3135H41.314V67.1275H30.5V56.3135Z" fill="#FF800B" stroke="#10FFE2"/>
                    <path d="M66.0734 68.1279H76.8874V78.942H66.0734V68.1279Z" fill="#FF800B" stroke="#10FFE2"/>
                    <path d="M66.2046 79.9424H77.0187V90.7564H66.2046V79.9424Z" fill="#FF800B" stroke="#10FFE2"/>
                    <path d="M66.0734 91.7563H76.8874V102.57H66.0734V91.7563Z" fill="#FF800B" stroke="#10FFE2"/>
                    <path d="M78.0187 91.7563H88.8327V102.57H78.0187V91.7563Z" fill="#FF800B" stroke="#10FFE2"/>
                    <path d="M54.3906 91.8867H65.2046V102.701H54.3906V91.8867Z" fill="#FF800B" stroke="#10FFE2"/>
                    </svg>
                            <svg width="94" height="119" viewBox="0 0 94 119" fill="none" xmlns="http://www.w3.org/2000/svg"> <g filter="url(#filter0_d)"> <path d="M7.5 58.9999L32.5 98.9999C42.8333 62.1665 68.3 -7.60012 87.5 7.99988" stroke="#38AD67" strokeWidth="10"/> </g> <defs> <filter id="filter0_d" x="0.26001" y="0.76123" width="93.393" height="117.485" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"> <feFlood floodOpacity="0" result="BackgroundImageFix"/> <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/> <feOffset dy="4"/> <feGaussianBlur stdDeviation="1.5"/> <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"/> <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/> <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/> </filter> </defs> </svg>
                    </>

                }

                {
                    props.icon==="menu-plane-3" &&
                        <>
                    <svg viewBox="0 0 143 143" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="71.5" cy="71.5" r="66" fill="#10FFE2" stroke="#278EA5" strokeWidth="11"/>
                        <path d="M66.1684 44.5H77.3018V55.6334H66.1684V44.5Z" fill="#FF800B" stroke="#10FFE2"/>
                        <path d="M66.1684 56.6333H77.3018V67.7667H66.1684V56.6333Z" fill="#FF800B" stroke="#10FFE2"/>
                        <path d="M78.3018 56.6333H89.4352V67.7667H78.3018V56.6333Z" fill="#FF800B" stroke="#10FFE2"/>
                        <path d="M90.3004 56.499H101.434V67.6324H90.3004V56.499Z" fill="#FF800B" stroke="#10FFE2"/>
                        <path d="M102.434 56.499H113.567V67.6324H102.434V56.499Z" fill="#FF800B" stroke="#10FFE2"/>
                        <path d="M114.567 56.499H125.701V67.6324H114.567V56.499Z" fill="#FF800B" stroke="#10FFE2"/>
                        <path d="M53.9002 56.6333H65.0336V67.7667H53.9002V56.6333Z" fill="#FF800B" stroke="#10FFE2"/>
                        <path d="M41.7668 56.6333H52.9002V67.7667H41.7668V56.6333Z" fill="#FF800B" stroke="#10FFE2"/>
                        <path d="M29.6334 56.6333H40.7668V67.7667H29.6334V56.6333Z" fill="#FF800B" stroke="#10FFE2"/>
                        <path d="M17.5 56.6333H28.6334V67.7667H17.5V56.6333Z" fill="#FF800B" stroke="#10FFE2"/>
                        <path d="M66.0336 68.6318H77.167V79.7652H66.0336V68.6318Z" fill="#FF800B" stroke="#10FFE2"/>
                        <path d="M66.1684 80.7656H77.3018V91.899H66.1684V80.7656Z" fill="#FF800B" stroke="#10FFE2"/>
                        <path d="M66.0336 92.8989H77.167V104.032H66.0336V92.8989Z" fill="#FF800B" stroke="#10FFE2"/>
                        <path d="M78.167 92.8989H89.3004V104.032H78.167V92.8989Z" fill="#FF800B" stroke="#10FFE2"/>
                        <path d="M90.3004 92.8989H101.434V104.032H90.3004V92.8989Z" fill="#FF800B" stroke="#10FFE2"/>
                        <path d="M53.9002 92.8989H65.0336V104.032H53.9002V92.8989Z" fill="#FF800B" stroke="#10FFE2"/>
                        <path d="M41.7668 92.8989H52.9002V104.032H41.7668V92.8989Z" fill="#FF800B" stroke="#10FFE2"/>
                    </svg>
                            <svg width="94" height="119" viewBox="0 0 94 119" fill="none" xmlns="http://www.w3.org/2000/svg"> <g filter="url(#filter0_d)"> <path d="M7.5 58.9999L32.5 98.9999C42.8333 62.1665 68.3 -7.60012 87.5 7.99988" stroke="#38AD67" strokeWidth="10"/> </g> <defs> <filter id="filter0_d" x="0.26001" y="0.76123" width="93.393" height="117.485" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"> <feFlood floodOpacity="0" result="BackgroundImageFix"/> <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/> <feOffset dy="4"/> <feGaussianBlur stdDeviation="1.5"/> <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"/> <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/> <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/> </filter> </defs> </svg>
                    </>
                }

                {
                    props.icon==="menu-rotate-right" &&
                    <svg viewBox="0 0 112 112" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="56" cy="56" r="52" fill="#10FFE2" stroke="#278EA5" strokeWidth="8"/>
                        <path d="M27 62.8407C35.3333 43.3407 56.9 16.0407 76.5 62.8407" stroke="#1F4287" strokeWidth="5"/>
                        <path d="M65.5 58L76.5 63L80 53" stroke="#1F4287" strokeWidth="5"/>
                    </svg>
                }

                {
                    props.icon==="menu-rotate-left" &&
                    <svg viewBox="0 0 112 112" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle r="52" transform="matrix(-1 0 0 1 56 56)" fill="#10FFE2" stroke="#278EA5" strokeWidth="8"/>
                        <path d="M85 62.8407C76.6667 43.3407 55.1 16.0407 35.5 62.8407" stroke="#1F4287" strokeWidth="5"/>
                        <path d="M46.5 58L35.5 63L32 53" stroke="#1F4287" strokeWidth="5"/>
                    </svg>
                }

                {
                    props.icon==="menu-small-strike" &&
                        <>
                    <svg viewBox="0 0 143 143" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="71.5" cy="71.5" r="66" fill="#10FFE2" stroke="#278EA5" strokeWidth="11"/>
                        <path d="M88 87L72 71M56 55L72 71M72 71L88 55L56 87" stroke="#A51C2D" strokeWidth="4"/>
                        <rect opacity="0.85" x="46.5" y="46.5" width="49" height="49" stroke="#29312F" strokeWidth="3"/>
                    </svg>
                            <svg width="94" height="119" viewBox="0 0 94 119" fill="none" xmlns="http://www.w3.org/2000/svg"> <g filter="url(#filter0_d)"> <path d="M7.5 58.9999L32.5 98.9999C42.8333 62.1665 68.3 -7.60012 87.5 7.99988" stroke="#38AD67" strokeWidth="10"/> </g> <defs> <filter id="filter0_d" x="0.26001" y="0.76123" width="93.393" height="117.485" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"> <feFlood floodOpacity="0" result="BackgroundImageFix"/> <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/> <feOffset dy="4"/> <feGaussianBlur stdDeviation="1.5"/> <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"/> <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/> <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/> </filter> </defs> </svg>
                    </>

                }

                {
                    props.icon==="menu-medium-strike" &&
                        <>
                    <svg viewBox="0 0 143 143" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="71.5" cy="71.5" r="66" fill="#10FFE2" stroke="#278EA5" strokeWidth="11"/>
                        <path d="M66.4615 65.8461L56.6154 56M46.7692 46.1538L56.6154 56M56.6154 56L66.4615 46.1538L46.7692 65.8461" stroke="#A51C2D" strokeWidth="3"/>
                        <rect opacity="0.85" x="41.5" y="41.5" width="29" height="29" stroke="#29312F" strokeWidth="3"/>
                        <path d="M96.6923 66.6923L86.8462 56.8462M77 47L86.8462 56.8462M86.8462 56.8462L96.6923 47L77 66.6923" stroke="#A51C2D" strokeWidth="3"/>
                        <rect opacity="0.85" x="72.5" y="41.5" width="29" height="29" stroke="#29312F" strokeWidth="3"/>
                        <path d="M66.4615 95.8461L56.6154 86M46.7692 76.1538L56.6154 86M56.6154 86L66.4615 76.1538L46.7692 95.8461" stroke="#A51C2D" strokeWidth="3"/>
                        <rect opacity="0.85" x="41.5" y="71.5" width="29" height="29" stroke="#29312F" strokeWidth="3"/>
                        <path d="M97.4615 95.8461L87.6154 86M77.7692 76.1538L87.6154 86M87.6154 86L97.4615 76.1538L77.7692 95.8461" stroke="#A51C2D" strokeWidth="3"/>
                        <rect opacity="0.85" x="72.5" y="71.5" width="29" height="29" stroke="#29312F" strokeWidth="3"/>
                    </svg>
                    <svg width="94" height="119" viewBox="0 0 94 119" fill="none" xmlns="http://www.w3.org/2000/svg"> <g filter="url(#filter0_d)"> <path d="M7.5 58.9999L32.5 98.9999C42.8333 62.1665 68.3 -7.60012 87.5 7.99988" stroke="#38AD67" strokeWidth="10"/> </g> <defs> <filter id="filter0_d" x="0.26001" y="0.76123" width="93.393" height="117.485" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"> <feFlood floodOpacity="0" result="BackgroundImageFix"/> <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/> <feOffset dy="4"/> <feGaussianBlur stdDeviation="1.5"/> <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"/> <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/> <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/> </filter> </defs> </svg>
                    </>


                }

                {
                    props.icon==="menu-big-strike" &&
                        <>
                    <svg viewBox="0 0 143 143" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="71.5" cy="71.5" r="66" fill="#10FFE2" stroke="#278EA5" strokeWidth="11"/>
                        <path d="M55.4214 55.9463L47.8227 48.3477M40.224 40.749L47.8227 48.3477M47.8227 48.3477L55.4214 40.749L40.224 55.9463" stroke="#A51C2D" strokeWidth="2"/>
                        <rect opacity="0.85" x="36" y="37" width="22.6957" height="22.6957" stroke="#29312F" strokeWidth="2"/>
                        <path d="M104.041 55.9463L96.4423 48.3477M88.8436 40.749L96.4423 48.3477M96.4423 48.3477L104.041 40.749L88.8436 55.9463" stroke="#A51C2D" strokeWidth="2"/>
                        <rect opacity="0.85" x="84.6195" y="37" width="22.6957" height="22.6957" stroke="#29312F" strokeWidth="2"/>
                        <path d="M79.3453 102.251L71.7466 94.6524M64.148 87.0537L71.7466 94.6524M71.7466 94.6524L79.3453 87.0537L64.148 102.251" stroke="#A51C2D" strokeWidth="2"/>
                        <rect opacity="0.85" x="59.9239" y="83.3042" width="22.6957" height="22.6957" stroke="#29312F" strokeWidth="2"/>
                        <path d="M104.041 102.251L96.4423 94.6524M88.8436 87.0537L96.4423 94.6524M96.4423 94.6524L104.041 87.0537L88.8436 102.251" stroke="#A51C2D" strokeWidth="2"/>
                        <rect opacity="0.85" x="84.6195" y="83.3042" width="22.6957" height="22.6957" stroke="#29312F" strokeWidth="2"/>
                        <path d="M55.4214 102.251L47.8227 94.6524M40.224 87.0537L47.8227 94.6524M47.8227 94.6524L55.4214 87.0537L40.224 102.251" stroke="#A51C2D" strokeWidth="2"/>
                        <rect opacity="0.85" x="36" y="83.3042" width="22.6957" height="22.6957" stroke="#29312F" strokeWidth="2"/>
                        <path d="M104.041 79.0987L96.4423 71.5M88.8436 63.9014L96.4423 71.5M96.4423 71.5L104.041 63.9014L88.8436 79.0987" stroke="#A51C2D" strokeWidth="2"/>
                        <rect opacity="0.85" x="84.6195" y="60.1523" width="22.6957" height="22.6957" stroke="#29312F" strokeWidth="2"/>
                        <path d="M79.3453 55.9463L71.7466 48.3477M64.148 40.749L71.7466 48.3477M71.7466 48.3477L79.3453 40.749L64.148 55.9463" stroke="#A51C2D" strokeWidth="2"/>
                        <rect opacity="0.85" x="59.9239" y="37" width="22.6957" height="22.6957" stroke="#29312F" strokeWidth="2"/>
                        <path d="M55.4214 79.0987L47.8227 71.5M40.224 63.9014L47.8227 71.5M47.8227 71.5L55.4214 63.9014L40.224 79.0987" stroke="#A51C2D" strokeWidth="2"/>
                        <rect opacity="0.85" x="36" y="60.1523" width="22.6957" height="22.6957" stroke="#29312F" strokeWidth="2"/>
                        <path d="M79.3453 79.0987L71.7466 71.5M64.148 63.9014L71.7466 71.5M71.7466 71.5L79.3453 63.9014L64.148 79.0987" stroke="#A51C2D" strokeWidth="2"/>
                        <rect opacity="0.85" x="59.9239" y="60.1523" width="22.6957" height="22.6957" stroke="#29312F" strokeWidth="2"/>
                    </svg>
                            <svg width="94" height="119" viewBox="0 0 94 119" fill="none" xmlns="http://www.w3.org/2000/svg"> <g filter="url(#filter0_d)"> <path d="M7.5 58.9999L32.5 98.9999C42.8333 62.1665 68.3 -7.60012 87.5 7.99988" stroke="#38AD67" strokeWidth="10"/> </g> <defs> <filter id="filter0_d" x="0.26001" y="0.76123" width="93.393" height="117.485" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"> <feFlood floodOpacity="0" result="BackgroundImageFix"/> <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/> <feOffset dy="4"/> <feGaussianBlur stdDeviation="1.5"/> <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"/> <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/> <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/> </filter> </defs> </svg>
                    </>


                }
            </button>

            <p>{props.info}</p>
        </div>
        </>
}

export default GameMenuButton