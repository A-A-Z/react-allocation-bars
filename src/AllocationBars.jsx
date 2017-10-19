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
              job: 0,
              hours: 8
            },
            {
              job: 1,
              hours: 16
            },
            {
              job: 2,
              hours: 1
            }
          ]
        },
        {
          dateLabel: '23 OCT 2017',
          jobs: [
            {
              job: 0,
              hours: 20
            },
            {
              job: 1,
              hours: 18
            },
            {
              job: 2,
              hours: 2
            }
          ]
        },
        {
          dateLabel: '30 OCT 2017',
          jobs: [
            {
              job: 0,
              hours: 20
            },
            {
              job: 1,
              hours: 40
            },
            {
              job: 2,
              hours: 20
            }
          ]
        }

      ],
      jobs: [
        {
          id: 123,
          label: 'Job Number One'
        },
        {
          id: 456,
          label: 'Job Number Two'
        },
        {
          id: 789,
          label: 'Job Number Three'
        }
      ]
    })
  }

  formatBlockLabel = (hoursNum) => {
    const hoursText = (hoursNum < 5) ? '' : ' Hours'
    return `${hoursNum}${hoursText}`
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

  formatHoursLabel = (hoursNum) => {
    if (hoursNum > 0) {
      return `${hoursNum} unallocated hours`
    } else if (hoursNum < 0) {
      return `${(hoursNum * -1)} overallocatied hours`
    } else {
      return 'Fully allocated'
    }
  }

  getOverallocatiedPer = (remainingHours) => {
    const per = Math.round(this.state.weekHours / ((remainingHours * -1) + this.state.weekHours) * 100)
    return per + '%'
  }

  render() {
    return (
      <div>
        <div className='allocation-bar-container'>
          {this.state.allocations.map((allocation, i1) => {
            const remainingHours = this.getRemainingHours(allocation.jobs)
            const classes = (remainingHours < 0) ? 'allocation-bar overallocatied' : 'allocation-bar'
            const barStyle = {
              width: (remainingHours < 0) ? this.getOverallocatiedPer(remainingHours) : '100%'
            }
            return (
              <div key={`allocation-${i1}`} className={classes}>
                <div className='labels'>
                  <div className='date'>{allocation.dateLabel}</div>
                  <div className='hours'>{this.formatHoursLabel(remainingHours)}</div>
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
                <div className='border' style={barStyle} />
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

export default AllocationBars;
