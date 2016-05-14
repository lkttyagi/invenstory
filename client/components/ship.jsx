import React from 'react'
import { Button, Input, Dialog, Slider } from 'react-toolbox'

export default (props) =>

  <Dialog active={props.active} onOverlayClick={props.handleShipModal}>
    <div>
      <h3 className="styles__centerBlack___2j9F5">Please select <span style={{color: "red"}}>SHIP QUANTITY</span> for:</h3>
      <h4 style={{"textAlign": "center"}}>{props.data.amzn_title}</h4>
      <img 
        src={props.data.amzn_thumb_url} 
        style={{width: 100, height:100, padding:0, display:"block", margin:"auto"}}
      />


      <h4 className="styles__centerBlack___2j9F5">SKU: {props.data.seller_sku}</h4>
      <h4 className="styles__centerBlack___2j9F5">Current Unit Value: ${props.data.amzn_price_fba || props.data.amzn_price_fbm}</h4>
      <h4 className="styles__centerBlack___2j9F5">Current Quantity: {props.data.quantity}</h4>
      <h4 className="styles__centerBlack___2j9F5">
      Gain: <span style={{color: "green"}}>{props.data.profit}%</span></h4>
      <h5 className="styles__shipInfo___1FFPQ">TOT Cost: ${(props.data.avg_purchase_price * props.ship_quantity).toFixed(2)}</h5>
      <h5 className="styles__shipInfo___1FFPQ">TOT Value: ${((props.data.amzn_price_fba || props.data.amzn_price_fbm) * props.ship_quantity).toFixed(2)}</h5>
      <h5 className="styles__shipInfo___1FFPQ">NET Gain: ${(((props.data.amzn_price_fba || props.data.amzn_price_fbm) - props.data.avg_purchase_price) * props.ship_quantity).toFixed(2)}</h5>
    </div>
    <Slider
      className="styles__detailSlider___317hh"
      snaps={true}
      pinned={false}
      min={0}
      max={props.data.quantity}
      step={1}
      editable={true}
      value={Number(props.ship_quantity) || 0}
      onChange={props.handleQuantityChange.bind(this)}
    />
    <div className='text-center'>
      <Button
        className="styles__inlineButton___16AEc"
        label='Ship'
        raised floating primary
        onMouseUp={props.confirmShip.bind(null, props.data.id)}
      />
      <Button
        className="styles__inlineButton___16AEc"
        label='Cancel'
        raised floating
        onMouseUp={props.handleShipModal.bind(this)}
      />
    </div>
  </Dialog>

