import React from "react";
import ReactDOM from 'react-dom';
import cheerio from "cheerio";
import renderHTML from "react-render-html";

function RenderHtml(result = []) {
  if (result) {
    if (result.length > 1) {
      return result.map((item) => {
        return renderHTML(String(item));
      });
    } else {
      return renderHTML(String(result))
    }
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { url: "", selector: "", result: [] };
  }

  setStateFor(name, value) {
    this.setState({
      [name]: value
    });
  }

  render() {
    let url = this.state.url;
    let selector = this.state.selector;
    let result = this.state.result;
    const returned = RenderHtml(result);
    
    const inputStyle = {
     padding: "5px",
     margin: "5px",
    };
    return (
      <div>
        <div>
          <form style={{ border: "1px solid black", width: "100%", position: "relative" }}>
            <input
              type="url"
              style={inputStyle}
              value={url}
              placeholder="type url here (http/s ...)"
              onChange={event => this.setStateFor("url", event.target.value)}
            />
            <div style={{ marginTop: 18 }} />
            <input
              type="text"
              style={inputStyle}
              pattern="/^[.]\w+\s?[.]?\w+/"
              placeholder="type css selector here (. #)"
              onChange={event =>
                this.setStateFor("selector", event.target.value)
              }
              value={selector}
            />
            <div style={{ marginTop: 18 }} />
            <input
              type="submit"
              value="Submit"
              style= {{ marginLeft: "5px"}}
              onClick={event => {
                event.preventDefault();
                const regex = new RegExp(/^[.#]\w+\s?[.]?\w+/);
                const urlRegex = new RegExp(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/);
                
                if (!regex.test(selector) || !urlRegex.test(url)) {
                  alert("Type in valid css selector and url.");
                  return;
                }
                fetch(`https://cors-anywhere.herokuapp.com/${url}`)
                .then(response=>response.text())
                .then(text => {
                  if (text) {
                    let result = [];
                    const $ = cheerio.load(text);
                    result = $(selector).toArray();
                    let html = result.map(r => $(r).html());
                    this.setState({
                      result: html
                    })
                  }
                })
                .catch(error => {
                  console.log('greska');
                })
              }}
            />
          </form>
          <div>
             Result: {returned}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
