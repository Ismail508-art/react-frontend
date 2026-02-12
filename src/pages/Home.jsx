
import Address from '../Components/adress/Address'
import Describe from '../Components/Describe/Describe'
import Offers from '../Components/offers/Offers'
import FollowUs from '../Components/Followus/FollowUs'
import MicroFooter from '../Components/Footer/MicroFooter'
import WhatWeOffer from '../Components/WhatWeOffer/WhatWeOffer'
const Home = () => {
  return (
    <div>
      <Describe/>
      <Offers/>
      <WhatWeOffer/>
      <Address/>
      <FollowUs/>
      <MicroFooter/>
    </div>
  )
}

export default Home
