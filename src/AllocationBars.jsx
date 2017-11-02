import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './style/app.scss'

class AllocationBars extends Component {
  constructor(props) {
    super(props)
    this.state = {
      jobs: [],
      allocations: [],
      weekHours: this.props.hoursPerWeek,
      jobColours: [
        '#6F7793',
        '#7189AD',
        '#71A1A8',
        '#71A386',
        '#77A070',
        '#959E71',
        '#9B8C70'
      ],
      activeJob: null
    }

    // this.setActiveJob = this.setActiveJob.bind(this)
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
    const hoursText = (hoursNum < 5) ? 'h' : ' Hours'
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
      return `Overallocatied by ${(hoursNum * -1)} hours`
    } else {
      return 'Fully allocated'
    }
  }

  getOverallocatiedPer = (remainingHours) => {
    const per = Math.round(this.state.weekHours / ((remainingHours * -1) + this.state.weekHours) * 100)
    return per + '%'
  }

  getBlockTitle = (blockJob) => {
    const job = this.state.jobs[blockJob.job]
    const hoursText = (blockJob.hours === 1) ? 'hour' : 'hours'
    return `${job.label} - ${blockJob.hours} ${hoursText}`
  }

  getJobColour = (index) => {
    if (index >= this.state.jobColours.length) {
      return this.getJobColour((index - this.state.jobColours.length))
    } else {
      return this.state.jobColours[index]
    }
  }

  render() {
    return (
      <div className='allocation-graph'>
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
                      width: this.getBlockWidth(block.hours),
                      backgroundColor: this.getJobColour(block.job)
                    }
                    const blockClass = (this.state.activeJob === block.job) ? 'block active' : 'block'
                    const onBlockOver = () => {
                      this.setState({ activeJob: block.job })
                    }
                    const onBlockOut = () => {
                      this.setState({ activeJob: null })
                    }
                    return (
                      <a
                        key={`allocation-${i1}-block-${i2}`}
                        href="job.html"
                        className={blockClass}
                        tabIndex='0'
                        style={blockStyle}
                        title={this.getBlockTitle(block)}
                        onMouseOver={onBlockOver}
                        onMouseOut={onBlockOut}
                        onFocus={onBlockOver}
                        onBlur={onBlockOut}
                      >
                        {this.formatBlockLabel(block.hours)}
                      </a>
                    )
                  })}
                </div>
                <div className='border' style={barStyle} />
              </div>
            )
          })}
        </div>

        <ul className='jobs'>
          {this.state.jobs.map((job, i) => {
            const jobStyle = {
              backgroundColor: this.getJobColour(i)
            }
            const jobClass = (this.state.activeJob === i) ? 'job active' : 'job'
            const onBlockOver = () => {
              this.setState({ activeJob: i })
            }
            const onBlockOut = () => {
              this.setState({ activeJob: null })
            }
            return (
              <li
                key={`job-${job.id}`}
                className={jobClass}
                onMouseOver={onBlockOver}
                onMouseOut={onBlockOut}
              >
                <a href='job.html'>
                  <span className='colour-block' style={jobStyle} />
                  <span>{job.id}</span>
                  <span>{job.label}</span>
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}

AllocationBars.defaultProps = {
  hoursPerWeek: 40
}

AllocationBars.propTypes = {
  hoursPerWeek: PropTypes.number
}

export default AllocationBars;
