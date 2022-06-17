import React, { CSSProperties, useEffect, useRef, useState } from "react";

export interface ParallaxImageProps extends React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
    viewportHeight: number | `${number}px` | `${number}%`
    containerRef?: React.LegacyRef<HTMLDivElement> | undefined;
    containerStyle?: CSSProperties
}

const lockedContainerStyles: CSSProperties = {
    overflow: "hidden",
    width: "fit-content",

    height: "viewportHeight"
}

export default function ParallaxImage(props: ParallaxImageProps) {
    const [height, setHeight] = useState( validateAndGetHeight(props) );
    if (!height) { throw Error('Parallax Image: Either the height prop, or a value for style.height is required.') }

    const containerStyle: CSSProperties = {...props.containerStyle, ...lockedContainerStyles};
    containerStyle.height = props.viewportHeight
    const [loadStarted, setLoadStarted] = useState(false);
    const [loadFinished, setLoadFinished] = useState(false)
    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(()=>{ setLoadStarted(true) }, []);
    useEffect(load, [loadStarted])

    function load() {
        if (!loadStarted) { return }

        warnUserIfStylesOverridden(props.containerStyle);
        const img = imageRef.current as HTMLImageElement;
        window.addEventListener('scroll', (event) => { handleScroll(event, img) })
        setLoadFinished(true);
    }

    function handleScroll(event: Event, img: HTMLImageElement) {
        const percentageOfPageScrolled = window.scrollY / (document.documentElement.offsetHeight - window.innerHeight);

    }

    //We have to remove a few items from our props before passing because React won't recognize those as a DOM element prop
    //The Partial<> is because containerStyle is required
    const imgPropsToPass: Partial<ParallaxImageProps> = { ...props }
    delete imgPropsToPass.containerRef;
    delete imgPropsToPass.containerStyle;
    delete imgPropsToPass.viewportHeight

    return (
        <div
            style={{
                margin: 0,
                padding: 0,
                ...containerStyle,
            }}
            ref={props.containerRef}
        >

            <img
                style={{ margin: 0, padding: 0 }}
                width={"100%"}
                height={"100%"}
                {...imgPropsToPass}
                ref={loadFinished && props.ref ? props.ref : imageRef}
            />
        </div>
    )
}

function warnUserIfStylesOverridden(appliedStyles: { [key: string]: any } | undefined) {
    if (!appliedStyles) { return }
    
    const locked = lockedContainerStyles as { [key: string]: any }
    for (const style in locked) {
        if (appliedStyles[style]) {
            console.warn(`ParallaxImage: You attempted to apply "${appliedStyles[style]}" ${style} on the container element, but that was overridden with "${locked[style]}"`)
        }
    }
}

function validateAndGetHeight(props: ParallaxImageProps) {
    if (props.height && props.style?.height) {
        console.warn(`ParallaxImage: Both a height prop and a style.height were passed in. The height prop will be used.`)
    }
    let height = props.height || props.style?.height;
    if (!height) { return null };

    if (typeof height === "string") {
        if (!height.includes("%") && !height.includes("px") && Number.isNaN(Number(height)) ) { 
            return null 
        }

    }



    return height;
}