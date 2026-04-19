import NextImage, { ImageProps } from 'next/image'

const basePath = '/pop-blog'

const Image = ({ src, ...rest }: ImageProps) => <NextImage src={`${basePath}${src}`} {...rest} />

export default Image
