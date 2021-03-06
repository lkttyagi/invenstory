import React from 'react'
import { Table } from 'reactable'
import { Button, Input, Slider } from 'react-toolbox'
import { Chart } from 'react-google-charts'

export default ({historical, options, data, hideDetails, smartAdd, deleteAll, confirmShip, err_quantity, handleQuantityChange, quantity, handleShipModal, handleDeleteModal, setModalSize}) =>
<div className="styles__detailDisplay___2K0QU">
  <img className="styles__detailImage___3CFNO" src={data.amzn_thumb_url} />
  <h3 className="styles__detailTitle___2N12_" style={{display: "inline", "margin": "10px"}}> {data.amzn_title} </h3>
    <Button className="styles__detailCancel___dK0rK" icon='clear' floating mini onMouseUp={hideDetails} />
  <div className="styles__detailDescription___2v665"> {data.amzn_description && data.amzn_description.slice(0,240)} </div>
  <div> Sales Rank: {data.amzn_sales_rank} </div>
  <div> Weight: {data.amzn_weight} lbs</div>
  <div className="styles__detailButtonsDiv___3qeKQ">
    <Button className="styles__inlineButton___16AEc detailBut" label='Delete all' raised floating primary onMouseUp={handleDeleteModal.bind(this)} />
    <Button className="styles__inlineButton___16AEc detailBut" label='Add' raised floating primary onMouseUp={smartAdd.bind(null,data)} />
    <Button className="styles__inlineButton___16AEc detailBut" label='Ship' raised floating primary onMouseUp={handleShipModal.bind(this)} />
  </div>  

  <Chart className="styles__detailChart___1CgJr" chartType="LineChart" data={historical} options={options} />

</div>
