// Bolinha de loading

import { Ring } from 'ldrs/react'


export default function Loader() {
    return (
        <Ring
            size="40"
            stroke="5"
            bgOpacity="0"
            speed="2"
            color="white" 
        />
    )
}