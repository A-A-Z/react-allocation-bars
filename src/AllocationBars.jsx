import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import './style/app.scss'

class AllocationBars extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeJob: null,
      allocations: [],
      jobs: []
    }
  }

  componentWillMount () {
    this.parseData(this.props.allocationData)
  }

  parseData = (jsonData) => {
    const formatWeek = (allocations = [], weekNum = 0) => {
      allocations.push({
        dateLabel: this.getMonday(new Date(), (7 * weekNum)),
        jobs: []
      })
      weekNum ++
      if (weekNum < this.props.numOfWeeks) {
        return formatWeek(allocations, weekNum)
      } else {
        return allocations
      }
    }
    let jobs = []
    let allocations = formatWeek()
    const weekDateKeys = [
      'weekOne',
      'weekTwo',
      'weekThree',
      'weekFour'
    ]

    for (const [allocationIndex, allocation] of jsonData.data.entries()) {
      jobs.push({
        id: allocation.job.id,
        label: allocation.job.label,
        managerName: allocation.deliveryManager,
        role: allocation.myRole
      })

      for (let weekNo = 0; weekNo < this.props.numOfWeeks; weekNo++) {
        let weekHours = allocation[weekDateKeys[weekNo]]
        if (weekHours > 0) {
          allocations[weekNo].jobs.push({
            job: allocationIndex,
            hours: weekHours
          })
        }
      }
    }

    this.setState({
      allocations: allocations,
      jobs: jobs
    })
  }

  getMonday = (date, days) => {
    return moment(date).add(days,'days').startOf('isoweek').format("D MMM YYYY")
  }

  formatBlockLabel = (hoursNum) => {
    const hoursText = (hoursNum < 4) ? 'h' : ' Hours'
    return `${hoursNum}${hoursText}`
  }

  getBlockWidth = (hoursNum) => {
    const per = Math.round((hoursNum / this.props.hoursPerWeek) * 100)
    return per + '%'
  }

  getRemainingHours = (jobs) => {
    let remainingHours = this.props.hoursPerWeek

    for (let job of jobs) {
      remainingHours -= job.hours
    }

    return remainingHours
  }

  formatHoursLabel = (hoursNum) => {
    if (hoursNum > 0 && hoursNum < this.props.hoursPerWeek) {
      let allocatedHours = this.props.hoursPerWeek - hoursNum
      return `${allocatedHours} allocated hours / ${hoursNum} unallocated hours`
    } else if (hoursNum === this.props.hoursPerWeek) {
      return 'No allocations'
    } else if (hoursNum < 0) {
      return `Overallocatied by ${(hoursNum * -1)} hours`
    } else {
      return 'Fully allocated'
    }
  }

  getOverallocatiedPer = (remainingHours) => {
    const per = Math.round(this.props.hoursPerWeek / ((remainingHours * -1) + this.props.hoursPerWeek) * 100)
    return per + '%'
  }

  getBlockTitle = (blockJob) => {
    const job = this.state.jobs[blockJob.job]
    const hoursText = (blockJob.hours === 1) ? 'hour' : 'hours'
    return `${job.label} - ${blockJob.hours} ${hoursText}`
  }

  getJobColour = (index) => {
    const jobId = this.state.jobs[index].id

    // first check if is leave
    if (this.isLeave(jobId)) {
      return this.props.leaveColour
    }

    // otherwise give job colour
    if (index >= this.props.jobColours.length) {
      // too many jobs, overflow colours
      return this.getJobColour((index - this.props.jobColours.length))
    } else {
      // return job colour
      return this.props.jobColours[index]
    }
  }

  isLeave = (jobId) => {
    return (this.props.leaveIds.indexOf(jobId) !== -1)
  }

  formatJobLink = (id) => {
    const urlFormat = this.props.jobLinkFormat
    return urlFormat.replace(/\{id\}/g, id)
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
                    const jobId = this.state.jobs[block.job].id
                    const blockStyle = {
                      width: this.getBlockWidth(block.hours),
                      backgroundColor: this.getJobColour(block.job)
                    }
                    let blockClass = (this.isLeave(jobId)) ? 'block leave' : 'block'
                    const onBlockOver = () => {
                      this.setState({ activeJob: block.job })
                    }
                    const onBlockOut = () => {
                      this.setState({ activeJob: null })
                    }
                    const jobUrl = (this.isLeave(jobId)) ? '#' :  this.formatJobLink(jobId)
                    if (this.state.activeJob === block.job) { blockClass += ' active' }
                    return (
                      <a
                        key={`allocation-${i1}-block-${i2}`}
                        href={jobUrl}
                        className={blockClass}
                        tabIndex='0'
                        style={blockStyle}
                        title={this.getBlockTitle(block)}
                        onMouseOver={onBlockOver}
                        onMouseOut={onBlockOut}
                        onFocus={onBlockOver}
                        onBlur={onBlockOut}
                      >
                        <div>
                          <div className='block-hours'>{this.formatBlockLabel(block.hours)}</div>
                          {(block.hours > 4) ? (
                            <div className='block-job'>{this.state.jobs[block.job].label}</div>
                          ) : ( <span /> )}
                        </div>
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
            const jobUrl = this.formatJobLink(job.id)
            return (
              <li
                key={`job-${job.id}`}
                className={jobClass}
                onMouseOver={onBlockOver}
                onMouseOut={onBlockOut}
              >
                {(this.isLeave(job.id)) ? (
                  <div className='job-link leave'>
                    <span className='colour-block' style={jobStyle} />
                    <span>{job.label}</span>
                  </div>
                ) : (
                  <a href={jobUrl} className='job-link'>
                    <span className='colour-block' style={jobStyle} />
                    <span>{job.id}</span>
                    <span>{job.label}</span>
                  </a>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}

AllocationBars.defaultProps = {
  hoursPerWeek: 40,
  jobColours: [
    '#6F7793',
    '#7189AD',
    '#71A1A8',
    '#71A386',
    '#77A070',
    '#959E71',
    '#9B8C70'
  ],
  leaveColour: '#e2e2e2',
  leaveIds: [
    1166,
    1462,
    13263
  ],
  numOfWeeks: 4
}

AllocationBars.propTypes = {
  allocationData: PropTypes.object.isRequired,
  hoursPerWeek: PropTypes.number,
  jobColours: PropTypes.array,
  jobLinkFormat: PropTypes.string.isRequired,
  leaveColour: PropTypes.string,
  leaveIds: PropTypes.array,
  numOfWeeks: PropTypes.number
}

export default AllocationBars;
