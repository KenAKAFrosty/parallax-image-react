import React, { CSSProperties } from "react";

export interface ParallaxImageProps extends React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
    containerRef?: React.LegacyRef<HTMLDivElement> | undefined;
    containerStyle?: React.CSSProperties
}

const lockedContainerStyles: CSSProperties = {
    overflow: "hidden"
}

export default function ParallaxImage(props: ParallaxImageProps) {
    if (props.containerStyle) { warnUserIfStylesOverridden(props.containerStyle) }

    return (
        <div
            style={{
                margin: 0,
                padding: 0,
                ...props.containerStyle,
                ...lockedContainerStyles,

            }}
            ref={props.containerRef} >

            <img
                style={{ margin: 0, padding: 0 }}
                width={"100%"}
                height={"100%"}
                {...props} />
        </div>
    )
}

function warnUserIfStylesOverridden(appliedStyles: { [key: string]: any }) {
    const locked = lockedContainerStyles as {[key: string]: any}
    for (const style in locked) {
        if (appliedStyles[style]) {
            console.warn(`You attempted to apply styling for ${style} on the container element, but that was overridden with the value: ${locked[style]}`)
        }
    }
}