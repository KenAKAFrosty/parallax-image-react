
export interface ParallaxImageProps extends React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
    containerRef?: React.LegacyRef<HTMLDivElement> | undefined
}

export default function ParallaxImage(props: ParallaxImageProps) {

    const propsToPass = props;
    delete propsToPass.containerRef
    return (
        <div>
            <img
                {...propsToPass}
            />
        </div>
    )
}