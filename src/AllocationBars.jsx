import React, { Component } from 'react';
import './style/app.scss';

class AllocationBars extends Component {
  constructor(props) {
    super(props)
    this.state = {
      jobs: [],
      allocations: [],
      weekHours: 40 // TODO: not hardcoded
    }
  }
  componentWillMount () {
    // TODO: not hardcoded
    this.setState({
      allocations: [
        {
          dateLabel: '16 OCT 2017',
          jobs: [
            {
              job: 1,
              hours: 8
            },
            {
              job: 2,
              hours: 16
            },
            {
              job: 3,
              hours: 1
            }
          ]
        },
        {
          dateLabel: '23 OCT 2017',
          jobs: [
            {
              job: 1,
              hours: 20
            },
            {
              job: 2,
              hours: 20
            }
          ]
        },
        {
          dateLabel: '30 OCT 2017',
          jobs: [
            {
              job: 1,
              hours: 32
            },
            {
              job: 2,
              hours: 16
            },
            {
              job: 3,
              hours: 8
            }
          ]
        }

      ]
    })
  }

  formatBlockLabel = (hoursNum) => {
    const hoursText = (hoursNum === 1) ? 'Hour' : 'Hours'
    return `${hoursNum} ${hoursText}`
  }

  getBlockWidth = (hoursNum) => {
    const per = Math.round((hoursNum / this.state.weekHours) * 100)
    return per + '%'
  }

  getRemainingHours = (jobs) => {
    let remainingHours = this.state.weekHours

    for (let job of jobs) {
      remainingHours -= job.hours
    }

    return remainingHours
  }

  render() {
    return (
      <div>
        <div className='allocation-bar-container'>
          {this.state.allocations.map((allocation, i1) => {
            const remainingHours = this.getRemainingHours(allocation.jobs)

            return (
              <div key={`allocation-${i1}`} className='allocation-bar'>
                <div className='labels'>
                  <div className='date'>{allocation.dateLabel}</div>
                  <div className='hours'>{remainingHours} unallocated hours</div>
                </div>
                <div className='blocks'>
                  {allocation.jobs.map((block, i2) => {
                    const blockStyle = {
                      width: this.getBlockWidth(block.hours)
                    }
                    return (
                      <div
                        key={`allocation-${i1}-block-${i2}`}
                        className='block'
                        tabIndex='0'
                        style={blockStyle}
                      >
                        {this.formatBlockLabel(block.hours)}
                      </div>
                    )
                  })}
                </div>
                <div className='border' />
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

export default AllocationBars;
