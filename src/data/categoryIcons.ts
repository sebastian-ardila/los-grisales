import {
  Storefront, Egg, ForkKnife, SunHorizon, IceCream, Funnel,
  Coffee, Snowflake, Martini, TeaBag, Champagne, PintGlass,
  OrangeSlice, Drop, Orange, BeerBottle, Wine, BeerStein,
  Globe, Flag, Plant, Leaf, Fire,
} from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'

export const categoryIconMap: Record<string, Icon> = {
  Storefront, Egg, ForkKnife, SunHorizon, IceCream, Funnel,
  Coffee, Snowflake, Martini, TeaBag, Champagne, Cocktail: PintGlass,
  OrangeSlice, Drop, Orange, BeerBottle, Wine, BeerStein,
  Globe, Flag, Plant, Leaf, Fire,
}
