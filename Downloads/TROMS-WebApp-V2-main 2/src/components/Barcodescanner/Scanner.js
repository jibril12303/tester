import React, { Component } from 'react'
import Quagga from 'quagga'
import PropTypes from "prop-types"

class Scanner extends Component {
  componentDidMount() {
    Quagga.init(
      {
        inputStream: {
          type: 'LiveStream',
          constraints: {
            width: 500,
            height: 400,
            facingMode: 'environment', // or user
          },
        },
        locator: {
          patchSize: 'medium',
          halfSample: true,
        },
        numOfWorkers: 4,
        decoder: {
          readers: ['code_128_reader'],
        },
        locate: true,
      },
      function(err) {
        if (err) {
          return console.log(err)
        }
        Quagga.start()
      },
    )
    Quagga.onDetected(this._onDetected)
  }

  componentWillUnmount() {
    Quagga.offDetected(this._onDetected)
  }

  _onDetected = result => {
    this.props.onDetected(result)
  }

  render() {
    return <div id="interactive" className="viewport" />
  }
}

Scanner.propTypes = {
    onDetected: PropTypes.any,
  }

export default Scanner
