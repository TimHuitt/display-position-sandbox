// get group (color) and property from selected element
function getGroup(element, type) {
    if (type == 'button') {
      const elementClass = $(element).parent().attr('class');
      const groupStart = elementClass.indexOf('-') + 1;
      return elementClass.slice(groupStart);
    } else {
      const elementClass = $(element).attr('class');
      const groupIndex = elementClass.lastIndexOf(' ') + 1;
      const propIndex = elementClass.indexOf('-', elementClass.indexOf(' ')) + 1;
      const prop = elementClass.slice(groupIndex);
      const group = elementClass.slice(propIndex, groupIndex - 1);
      return [group, prop];
    }
  }
  
  // get list of current colored box properties
  function getData() {
    const elements = ['blue', 'black', 'red'];
    const elementMap = {
      'blue':'', 
      'black':'', 
      'red':''
    };
    
    for (let element of elements) {
      const elementName = element
      const thisElement = $('.' + element);
      const jsElement = document.querySelector('.' + element)
      const rect = jsElement.getBoundingClientRect();
      const height = rect.width;
      const width = rect.height;
      const offset = $('.' + element).offset();
      const top = (offset.top == undefined) ? '-' : offset.top;
      const right = (offset.right == undefined) ? '-' : offset.right;
      const bottom = (offset.bottom == undefined) ? '-' : offset.bottom;
      const left = (offset.left == undefined) ? '-' : offset.left;
      
      elementMap[elementName] = [height, width, top, right, bottom, left];
    }
    return elementMap;
  }
  
  // set all slider and input data based on current box properties
  function setData(type) {
    const elements = ['blue', 'black', 'red']
    const properties = ['width', 'height', 'top', 'right', 'bottom', 'left']
    data = getData();
    
    let text = (type) ? false : true;
    let slider = (type) ? true : false;
    if (type === 2) {
      text = true;
      slider = true;
    }
    
    for (let element of elements) {
      const textClass = `.text.text-${element}`;
      const sliderClass = `.slider.slider-${element}`;
      
      for (let i = 0; i < properties.length; i++) {
        data[element][properties[i]] = data[element][i];
      }
      
      for (let property of properties) {
        if (text) {
          $(`${textClass}.${property}`).val(data[element][property]);
        }
        if (slider) {
          $(`${sliderClass}.${property}`).val(data[element][property]);
        }
      }
    }
  }
  
  // set box text based on current box properties
  function setBoxText() {
    const items = ['blue', 'black', 'red'];
    let count = 1
    
    for (let item of items) {
      const cssPos = $('.' + item).css('position');
      const cssDisplay = $('.' + item).css('display');
      
      $('.' + item).html(`
        <p class="box-${count}">${count}</p><p><br><br>${cssPos}<br><br>${cssDisplay}<br>
      `);
      count++;
    }
  }
  
  // toggle selected button and update box properties
  function toggleButton(element) {
    const group = getGroup(element, 'button');
    const btn = $(element).text();
    const posItems = ['static', 'relative', 'absolute', 'sticky', 'fixed'];
    const displayItems = ['block', 'inline-block', 'none', 'flex', 'grid']
    let display = false;
    let position = false;
    
    $('button').each(function(index, thisElement) {
      const thisGroup = getGroup(thisElement, 'button');
      const thisBtn = $(thisElement).text();
      
      if (group == thisGroup) {
        if (posItems.includes(thisBtn) && posItems.includes(btn)) {
          $(thisElement).removeClass('selected')
          position = true;
        }
        if (displayItems.includes(thisBtn) && displayItems.includes(btn)) {
          $(thisElement).removeClass('selected');
          display = true;
        }
      }
    });
      
    if (display) {
      $('.' + group).css('display', btn);
    }
    if (position) {
      $('.' + group).css('position', btn);
    }
    
    $(element).toggleClass('selected');
    display = false;
    position = false;
    setBoxText();
  }
  
  // handle and display slider and text input changes
  function handleInput(element, type) {
    const group = getGroup(element)[0];
    const property = getGroup(element)[1];
    const textClass = `.text.text-${group}`;
    const textVal = $(`${textClass}.${property}`).val();
    const sliderClass = `.slider.slider-${group}`;
    const sliderVal = $(`${sliderClass}.${property}`).val();
    
    if (type == 'text') {
      $(`${sliderClass}.${property}`).val(textVal);
    } else if (type == 'slider') {
      $(`${textClass}.${property}`).val(sliderVal);
    }
    
    if (property == 'top') {
      $('.' + group).css('bottom', 'auto');
      $(`${textClass}.bottom`).val('-');
      
    } else if (property == 'right') {
      $('.' + group).css('left', 'auto');
      $(`${textClass}.left`).val('-');
      
    } else if (property == 'bottom') {
      $('.' + group).css('top', 'auto');
      $(`${textClass}.top`).val('-');
      
    } else if (property == 'left') {
      $('.' + group).css('right', 'auto');
      $(`${textClass}.right`).val('-');
    }
  
    if (textVal == '-') {
      $('.' + group).css(property, 'auto');
      setData(1);
    } else {
      $('.' + group).css(property, sliderVal + 'px');
    }
  }
  
  // handle clicks and adjustments
  $('button').click(function() {
    toggleButton(this);
  });
  
  $('.slider').on('input', function() {
    handleInput(this, 'slider');
  });
  
  $('.text').on('input', function() {
    handleInput(this, 'text');
  });
  
  // initialize
  setData(2);
  setBoxText();