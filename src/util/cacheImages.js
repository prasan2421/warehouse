import { Image} from 'react-native';


export function cacheImages(images){
    return images.map(image =>{
        if (typeof image === 'string'){
            return Image.prefetch(image);
        }

    })
}