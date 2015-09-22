var Intro = React.createClass({
  render: function () {
    return (
      <div>
        <h2>Features</h2>
        <ul>
          <li>Add new book</li>
          <li>Search book</li>
          <li>Delete book</li>
        </ul>
        <h2>Features Updating ...</h2>
        <ul>
          <li>Update the book has read or hasnt</li>
          <li>Pagination</li>
        </ul>
      </div>
    );
  }
});

var BookList = React.createClass({
  handleUpdate: function (e) {
    this.props.onUpdate(e);
  },

  handleRemove: function (e) {
    this.props.onRemove(e);
  },

  render: function () {
    var itemList = this.props.data.map(function (data, index) {
      return (
        <tr className={index % 2 == 0 ? 'success' : ''}>
          <td>{index + 1}</td>
          <td>{data.name}</td>
          <td>{data.author}</td>
          <td>{data.publisher}</td>
          <td>{data.date}</td>
          <td>{data.pages}</td>
          <td onDoubleClick={this.handleUpdate} data-update-index={index}>{data.read === 'true' ? <code>Read</code> : 'Unread'}</td>
          <td><button className="btn btn-default btn-sm glyphicon glyphicon-remove" onClick={this.handleRemove} data-remove-index={index}></button></td>
        </tr>
      );
    }.bind(this));

    if (!itemList.length) {
      itemList = (<tr><td colSpan="8" className="text-center success">No Result</td></tr>);
    }

    return (
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Book Name</th>
            <th>Author</th>
            <th>Publisher</th>
            <th>Final Release Date</th>
            <th>Pages</th>
            <th>Read</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {itemList}
          <tr>
            <td colSpan="8" className="text-center">
              <ul className="pagination">
                <li><a href="#">1</a></li>
                <li className="active"><a href="#">2</a></li>
                <li><a href="#">3</a></li>
                <li><a href="#">4</a></li>
                <li><a href="#">5</a></li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
});

var AddBook  = React.createClass({
  handleSubmit: function (e) {
    e.preventDefault();

    var name      = React.findDOMNode(this.refs.name).value.trim();
    var author    = React.findDOMNode(this.refs.author).value.trim();
    var publisher = React.findDOMNode(this.refs.publisher).value.trim();
    var date      = React.findDOMNode(this.refs.date).value.trim();
    var pages     = React.findDOMNode(this.refs.pages).value.trim();

    if (!name.length || !author.length || !publisher.length || !date.length || !pages.length) {
      return;
    }

    this.props.onAddBook({
      name: name,
      author: author,
      publisher: publisher,
      date: date,
      pages: pages,
      read: false
    });

    React.findDOMNode(this.refs.name).value = '';
    React.findDOMNode(this.refs.author).value = '';
    React.findDOMNode(this.refs.publisher).value = '';
    React.findDOMNode(this.refs.date).value = '';
    React.findDOMNode(this.refs.pages).value = '';
  },

  render: function () {
    return (
      <div>
        <h2 className="text-center">Add Book</h2>
        <form role="form" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label className="control-label col-sm-2" for="name">Name</label>
            <div className="col-sm-10">
              <input type="text" ref="name" className="form-control" placeholder="Book name" />
            </div>
          </div>
          <div className="form-group">
            <label className="control-label col-sm-2" for="author">Author</label>
            <div className="col-sm-10">
              <input type="text" ref="author" className="form-control" placeholder="Author" />
            </div>
          </div>
          <div className="form-group">
            <label className="control-label col-sm-2" for="publisher">Publisher</label>
            <div className="col-sm-10">
              <input type="text" ref="publisher" className="form-control" placeholder="Publisher" />
            </div>
          </div>
          <div className="form-group">
            <label className="control-label col-sm-2" for="date">Final Release Date</label>
            <div className="col-sm-10">
              <input type="text" ref="date" className="form-control" placeholder="Final Release Date" />
            </div>
          </div>
          <div className="form-group">
            <label className="control-label col-sm-2" for="pages">Pages</label>
            <div className="col-sm-10">
              <input type="text" ref="pages" className="form-control" placeholder="Pages" />
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button type="submit" className="btn btn-default">Add Book</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
});


var SearchBook = React.createClass({
  handleChange: function (e) {
    this.props.onSearch(e.target.value);
  },

  render: function () {
    return (
      <form role="form">
        <div className="form-group">
          <div className="col-sm-12">
            <input type="text" onChange={this.handleChange} className="form-control" placeholder="Search ..." />
          </div>
        </div>
      </form>
    );
  }
});

var Books = React.createClass({
  getInitialState: function () {
    return {
      data: [],
      interval: null,
      timeout: null
    };
  },

  getData: function () {
    var that = this;

    return $.ajax({
      url: that.props.url,
      method: 'GET',
      dataType: 'json',
      cache: false,
      success: function (data) {
        that.setState({data: data});
      },
      error: function (xhr, status, err) {
        console.log(status, err);
      }
    });
  },

  componentDidMount: function () {
    this.getData();
    this.interval = setInterval(this.getData, this.props.timer);
  },

  handleSearch: function (text) {
    clearInterval(this.interval);

    if (!text) {
      this.getData();
      this.interval = setInterval(this.getData, this.props.timer);
    }

    var data = [];

    this.state.data.map(function (item) {
      if (item.name.toLowerCase().search(text.toLowerCase()) !== -1) {
        data.push(item);
      }
    });

    this.setState({data: data});
  },

  handleUpdate: function (e) {
    var target = $(e.target);
    var index = target.data('update-index');

    var read = '<button type="button" class="btn btn-default" data-update-read="yes">Yes</button>';
    var unread = '<button type="button" class="btn btn-default" data-update-read="no">No</button>';
    target.replaceWith('<td><div class="btn-group-vertical">' + read + unread + '</div></td>');

    $('[data-update-read]').on('click', function () {
      alert($(this).data('update-read'));
    });
  },

  handleRemove: function (e) {
    var that  = this;
    var books = that.state.data;
    var data  = {};

    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }

    data.index  = $(e.target).data('remove-index');
    data.action = 'REMOVE';

    return $.ajax({
      url: that.props.url,
      method: 'POST',
      dataType: 'json',
      data: data,
      success: function (data) {
        that.setState({data: data});
      },
      error: function (xhr, status, error) {
        console.log(status, error);
      }
    });
  },

  handleAddBook: function (data) {
    var that = this;
    var books = that.state.data;
    var newBook = books.concat([books]);
    that.setState({data: newBook});

    data.action = 'ADD';

    return $.ajax({
      url: that.props.url,
      method: 'POST',
      dataType: 'json',
      data: data,
      success: function (data) {
        that.setState({data: data});
      },
      error: function (xhr, status, error) {
        console.log(status, error);
      }
    });
  },

  render: function () {
    return (
      <div className="container">
        <h1 className="text-center">Books Management</h1>
        <SearchBook onSearch={this.handleSearch} />
        <BookList data={this.state.data} onUpdate={this.handleUpdate} onRemove={this.handleRemove} />
        <AddBook onAddBook={this.handleAddBook} />
        <Intro />
      </div>
    );
  }
});

React.render(
  <Books url="books.json" timer="2000" />,
  document.getElementById('wrapper')
);
