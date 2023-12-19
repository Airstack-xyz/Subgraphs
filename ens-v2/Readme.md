# Templates added (Check entities to see if any new got created)

- ETHRegistrarControllerTemplate
  - Entity `ControllerEntity`
- ETHRegistrarControllerNameWrapperTemplate
  - Entity `ControllerNameWrapperEntity`
- ResolverTemplate
  - Entity `ResolverEntity`
- ReverseRegistrarTemplate
  - Entity `ReverseRegistrarEntity`

Even if ENS adds these new contracts,It should work

# Testing specific test files

Run `graph test utils`

PrimaryDomain can get affected when

1. ResolvedAddress changed
2. Resolver changed
3. SetName changed


airDomain.id == airDomains.resolver.resolvedAddress.nameSet.domainId  -> set true 
existing domain with airDomains.resolver.resolvedAddress true -> set as false


tokenstaker -> resolver a -> 0xabc -> setName(tokenstaker)
               resolver b -> 0xcdf 

