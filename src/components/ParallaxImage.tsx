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
    const [height, setHeight] = useState(validateAndGetHeight(props));
    console.log(!!height)
    const [waitForImageToLoad, setWaitForImageToLoad] = useState(!height)
    if (waitForImageToLoad && isDev()) { 
        console.warn(`Image height was not explicitly passed. `)
    }

    const roomToSlide = getRoomToSlide(height, props.viewportHeight)

    const containerStyle: CSSProperties = { ...props.containerStyle, ...lockedContainerStyles };
    containerStyle.height = props.viewportHeight

    const [loadStarted, setLoadStarted] = useState(false);
    const [loadFinished, setLoadFinished] = useState(false)
    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(() => { setLoadStarted(true) }, []);
    useEffect(load, [loadStarted])

    function load() {
        if (!loadStarted) { return }
        warnUserIfStylesOverridden(props.containerStyle);
        const img = imageRef.current as HTMLImageElement;
        window.addEventListener('scroll', (event) => { handleScroll(event, img) })
        setLoadFinished(true);
    }

    function handleScroll(event: Event, img: HTMLImageElement) {
        const container = img.parentElement as HTMLDivElement
        const percentageScrolled = getPercentageScrolled(container);
        const pxToSlide = (percentageScrolled * roomToSlide) * -1;
        updateTransform(img, "translateY", `${pxToSlide}px`)
    }

    //We have to remove a few items from our props before passing because React won't recognize those as a DOM element prop
    //The Partial<> is because viewportHeight is required
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

function getRoomToSlide(height: string | number | null, viewportHeight: number | `${number}px` | `${number}%`): number {
    const pixelsHeight = !height ? 0
        : (typeof height === "number") ? height
            : height.includes('px') ? parseInt(height) : Number(height);

    if (!pixelsHeight || Number.isNaN(pixelsHeight)) {
        throw Error('Height was not passed as either a positive number or a string with "{positiveNumber}px" format');
    }

    const viewportPixelsHeight = (typeof viewportHeight === "number") ? viewportHeight
        : viewportHeight.includes("px") ? parseInt(viewportHeight)
            : (parseInt(viewportHeight) / 100) * pixelsHeight


    if (viewportHeight > pixelsHeight) {
        throw Error('Viewport height larger than height. Use default viewportheight, like 75% of height or something');
    };
    return pixelsHeight - viewportPixelsHeight
}


function warnUserIfStylesOverridden(appliedStyles: { [key: string]: any } | undefined) {
    if (!appliedStyles || !isDev()) { return }

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
        if (!height.includes("%") && !height.includes("px") && Number.isNaN(Number(height))) {
            return null
        }

    }


    return height;
}

function elementIsAboveTheFold(element: HTMLElement) {
    return getAbsoluteOffsetTop(element) < window.innerHeight
}

function elementIsOnBottomFold(element: HTMLElement) {
    return document.documentElement.offsetHeight - window.innerHeight < (element.offsetHeight + getAbsoluteOffsetTop(element));
}

function isDev() {
    return window.location.href.includes("localhost:") || window.location.href.includes("127.0.0.1");
}


type ImagePosition =
    | "middle"
    | "top"
    | "bottom"
    | "alwaysVisible"

function getPercentageScrolled(container: HTMLElement): number {
    const aboveFold = elementIsAboveTheFold(container);
    const isOnBottomFold = elementIsOnBottomFold(container);

    if (!aboveFold && !isOnBottomFold) {
        return percentageScrolledByImagePosition["middle"](container)
    }
    if (aboveFold && !isOnBottomFold) {
        return percentageScrolledByImagePosition["top"](container);
    }

    if (!aboveFold && isOnBottomFold) {
        return percentageScrolledByImagePosition["bottom"](container);
    }

    return percentageScrolledByImagePosition["alwaysVisible"](container)
}

type FunctionByImagePosition = {
    [Position in ImagePosition]: Function
}

const percentageScrolledByImagePosition: FunctionByImagePosition = {
    "middle": (element: HTMLElement) => {
        const pxScrolled = (Math.ceil(window.scrollY) + window.innerHeight) - getAbsoluteOffsetTop(element);
        const percentageScrolled = (pxScrolled / (window.innerHeight + element.offsetHeight));
        return getClampedPercentage(percentageScrolled)
    },
    "top": (element: HTMLElement) => {
        const percentageScrolled = Math.ceil(window.scrollY) / (getAbsoluteOffsetTop(element) + element.offsetHeight)
        return getClampedPercentage(percentageScrolled)
    },
    "bottom": (element: HTMLElement) => {
        const percentageScrolled = (Math.ceil(window.scrollY + window.innerHeight) - getAbsoluteOffsetTop(element)) /
            (document.documentElement.scrollHeight - getAbsoluteOffsetTop(element))
        return getClampedPercentage(percentageScrolled)
    },
    "alwaysVisible": (element: HTMLElement) => {
        const percentageScrolled = Math.ceil(window.scrollY) / (document.documentElement.scrollHeight - window.innerHeight);
        return getClampedPercentage(percentageScrolled);
    }
}

function getClampedPercentage(percentage: number) {
    return percentage < 0 ? 0 : percentage > 1 ? 1 : percentage
}


type TransformProperty =
    | "translate"
    | "translateX"
    | "translateY"
    | "translateZ"
    | "translate3d"
    | "skew"
    | "skewX"
    | "skewY"
    | "scale"
    | "scaleX"
    | "scaleY"
    | "rotate"
    | "rotate3d"
    | "rotateX"
    | "rotateY"
    | "rotateZ"
    | "perspective"
    | "matrix"
    | "matrix3d"


function updateTransform(element: HTMLElement, transformProperty: TransformProperty, transformValue: string) {
    const propertyRegex = new RegExp(transformProperty + "\\((.*?)\\)", "i");
    const matches = element.style.transform.match(propertyRegex);
    const updatedValue = `${transformProperty}(${transformValue})`
    if (!matches) {
        element.style.transform += ' ' + updatedValue
    } else {
        const replaced = element.style.transform.replace(propertyRegex, updatedValue)
        element.style.transform = replaced;
    }
}

function getTransformValue(element: HTMLElement, transformProperty: TransformProperty) {
    const propertyRegex = new RegExp(transformProperty + "\\((.*?)\\)", "i");
    const matches = element.style.transform.match(propertyRegex);
    if (!matches) { return null };
    return matches[1];
}

function getAbsoluteOffsetTop(element: HTMLElement) { 
    return (element.getBoundingClientRect().top + window.scrollY)
}