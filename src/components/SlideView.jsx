import React, { Component } from "react"
import Styled from "styled-components"
import PropTypes from "prop-types"

const SlideViewWrapper = Styled.div`
  position: relative;

  .slider-items {
    width: 100%;
    display: -webkit-inline-box;
    transition: all 0.5s ease;
    overflow: hidden;
  }

  .slider-navigation {
    position: absolute;
    width: 100%;
    float: left;
    bottom: 0;
    ul {
      padding: 0;
      li {
        list-style: none;
        display: inline-block;
        margin: 0 5px;
        cursor: pointer;
      }
    }
  }
`

class SlideView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: 0,
      elSlider: null
    }
  }

  componentDidMount() {
    this.setState({
      elSlider: document.querySelector(`#${this.props.id} .slider-items`)
    }, () => {
      if (this.props.auto) {
        this.sliderInterval = setInterval(() => {
          this.move("right")
        }, this.props.speed)
      }
    })
  }

  componentWillUnmount() {
    clearInterval(this.sliderInterval)
  }

  move(target) {
    this.setState(
      {
        active: this.setActive(target)
      },
      () => {
        const width = this.getWidthChilds()
        this.state.elSlider.scroll({
          left: width * this.state.active,
          behavior: "smooth"
        })
      }
    )
  }

  setActive(scrollTarget) {
    const childCount = this.state.elSlider.childElementCount
    let { active } = this.state
    if (scrollTarget === "right") {
      if (active < childCount - 1) {
        active++
      } else {
        active = 0
      }
    } else {
      if (active > -1) {
        active--
      } else {
        active = childCount
      }
    }

    return active
  }

  getTotalChilds() {
    return this.state.elSlider.childElementCount
  }

  getWidthChilds() {
    let width = this.state.elSlider.offsetWidth
    return width
  }

  render() {
    return (
      <SlideViewWrapper
        id={this.props.id}
        className={this.props.className}
        style={this.props.style}
      >
        <div className="slider-items">{this.props.children}</div>
        {this.state.elSlider && this.state.elSlider.childElementCount > 1 ? (
          <div className="slider-navigation">
            <ul>
              {(() => {
                let nav = []
                for (
                  let n = 0;
                  n < this.state.elSlider.childElementCount;
                  n++
                ) {
                  nav.push(
                    <li
                      key={n}
                      onClick={() => {
                        const oldActive = this.state.active
                        this.setState(
                          { active: this.state.active > n ? n + 1 : n - 1 },
                          () => {
                            // clearInterval(this.sliderInterval)
                            if (this.state.active > oldActive)
                              this.move("right")
                            else this.move("left")
                          }
                        )
                      }}
                    >
                      <span
                        className={
                          this.state.active === n
                            ? "dot-active"
                            : "dot-notactive"
                        }
                      />
                    </li>
                  )
                }

                return nav
              })()}
            </ul>
          </div>
        ) : null}
      </SlideViewWrapper>
    )
  }
}

SlideView.defaultProps = {
  id: "react-slideview",
  className: "",
  style: {},
  dots: false,
  navigation: false,
  auto: true,
  speed: 2000
}

SlideView.propTypes = {
  id: PropTypes.string.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  dots: PropTypes.bool,
  navigation: PropTypes.bool,
  auto: PropTypes.bool,
  speed: PropTypes.number
}

export default SlideView
