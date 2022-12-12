import mongoose from "mongoose";

export async function findAllById(model, ids){
    try {
        const totalIds = ids.length
        let results = []
        for(let i=0; i<totalIds; i++){
            const isFind = await model.findById({_id: ids[i]})
            if( !isFind ) continue
            results.push( isFind )
        }

        return results
    } catch (error) {
        return Promise.reject(error)
    }
}