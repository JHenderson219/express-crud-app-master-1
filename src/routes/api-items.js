var express = require('express');
var router = express.Router();
var startData = require('./../data.json');

/* =============================
Get all items
============================= */
router.get('/', function (req, res) {
  res.json(startData);
});

/* =============================
Get single item
============================= */
router.get('/:id', function (req, res) {
  var requestedId = req.params.id;
  var requestedItem;

  startData.map(function (item) {
    if (item.id === requestedId) {
      requestedItem = item;
    }
    return item;
  });

  // if item id is not found, let the user know
  if (requestedItem === undefined) {
    requestedItem = {
      success: false,
      message: 'item not found'
    }
  }
  res.json(requestedItem);
});

/* =============================
Add item
============================= */
router.post('/add', function (req, res) {

  var newItem = {
    content: req.body.content,
    id: Date.now().toString(),
    isComplete: false,
  }

  startData.push(newItem);
  var responseObject = {
    success: true,
    item: newItem,
  }
  res.json(responseObject);
});

/* =============================
Update item
============================= */
router.put('/update/:id', function (req, res) {
  var updatedItem = {
    id: req.params.id,
  }
  if (req.body.content) {
    updatedItem.content = req.body.content;
  }
  if (req.body.isComplete) {
    updatedItem.isComplete = req.body.isComplete;
  }

  var foundItem = false;
  startData = startData.map(function (item) {
    if (item.id === updatedItem.id) {
      foundItem = true;
      item = Object.assign({}, item, updatedItem);
      updatedItem = item;
    }
    return item;
  });

  if(foundItem) {
    res.json({
      success: true,
      item: updatedItem,
    });
  } else {
    res.json({
      success: false,
      message: 'item not found'
    });
  }
});

/* =============================
Delete item
============================= */
router.delete('/delete/:id', function (req, res) {
  var itemFound = false;
  var itemIndex;

  startData.map(function (item, index) {
    if (item.id === req.params.id) {
      itemFound = true;
      itemIndex = index;
    }
    return item;
  });


  if(itemFound) {
    startData.splice(itemIndex, 1);
    res.json({
      success: true,
    });
  } else {
    res.json({
      success: false,
      message: 'item not found'
    })
  }
});

module.exports = router;