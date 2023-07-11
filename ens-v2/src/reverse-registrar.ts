import { PrimarySet } from "../generated/schema"
import { SetNameCall } from "../generated/templates/ReverseRegistrar/ReverseRegistrar"
export function handleSetName(call: SetNameCall): void {
    const hash = call.transaction.hash
    const logIndex = call.transaction.index
    const id = hash
        .toHexString()
        .concat("-")
        .concat(logIndex.toString())
    let entity = new PrimarySet(id)
    entity.hash = hash
    entity.name = call.inputs.name

    entity.save()
}
