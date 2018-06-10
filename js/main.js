$(function() {

  var itemsInfo;
  var itemsArray;
  var skillsInfo;
  var skillsArray;
  var storeInfo;
  var storeArray;
  var itemTiers;
  var spellTiers;

  function initData() {
    $.getJSON('data/StorePrices.json', function(data) {
      saveJSON("prices", data.storePrices);
    });
    $.getJSON('data/itemTiers.json', function(data) {
      saveJSON("itiers", data);
    });
    $.getJSON('data/spellTiers.json', function(data) {
      saveJSON("stiers", data);
    });
    $.getJSON('data/ItemsInfo.json', function(data) {
      saveJSON("items", data.itemInfos);
    });
    $.getJSON('data/SkillsInfo.json', function(data) {
      saveJSON("skills", data.skillInfos);
    });

  }

  function saveJSON(type, jsondata) {

    if (type == "items") {
      itemsInfo = jsondata;
    } else if (type == "skills") {
      skillsInfo = jsondata;
    } else if (type == "prices") {
      storeInfo = jsondata;
    } else if (type == "itiers") {
      itemTiers = jsondata;
    } else if (type == "stiers") {
      spellTiers = jsondata;
    }
  }

  function getItemTier(item) {
    if ($.inArray(item, itemTiers[0]) != -1) {
      return 0
    } else if ($.inArray(item, itemTiers[1]) != -1) {
      return 1
    } else if ($.inArray(item, itemTiers[2]) != -1) {
      return 2
    } else if ($.inArray(item, itemTiers[3]) != -1) {
      return 3
    } else if ($.inArray(item, itemTiers[4])) {
      return 4
    } else {
      return -1
    }
  }

  function getSpellTier(spell) {
    if ($.inArray(spell, spellTiers[0]) != -1) {
      return 0
    } else if ($.inArray(spell, spellTiers[1]) != -1) {
      return 1
    } else if ($.inArray(spell, spellTiers[2]) != -1) {
      return 2
    } else if ($.inArray(spell, spellTiers[3]) != -1) {
      return 3
    } else if ($.inArray(spell, spellTiers[4]) != -1) {
      return 4
    } else {
      return -1
    }
  }

  function buildItems(items) {
    var ids = {};
    var names = {};

    h = $('#div-tabs-relics').html();
    //bad_spells = ["Negation Source", "Chronostasis", "Agents of Chaos",  "Chaotic Buster"];
    $.each(items, function(index, value) {
      ids[value.itemID] = value;
      names[value.displayName] = value;

    });
    Object.keys(names).sort().forEach(function(v, i){
      console.log(v,names[v]);
      name = names[v].displayName;
      id = names[v].itemID;
      lname = name.replace(/\s/g, "");
      lname = lname.toLowerCase();
      h = h + "<span id=\"relic-"+ lname + "\" class=\"infoclass relics\">        <img data-id=\"" + id + "\" src=\"img/relics/"+ name +".png\" />      </span>"

    });
    /*
    $.each(items, function(index, value) {
      name = value.displayName;
      //if ($.inArray(name, bad_spells) == -1) {
        id = value.itemID;
        lname = name.replace(/\s/g, "");
        lname = lname.toLowerCase();
        h = h + "<span id=\"relic-"+ lname + "\" class=\"infoclass relics\">        <img data-id=\"" + id + "\" src=\"img/relics/"+ name +".png\" />      </span>"
      //}
    });
    */

    $('#div-tabs-relics').html(h);
    console.log();
    return ids;
  }

  function buildArcana(spells) {
    var arr = {};
    h = $('#div-tabs-arcana').html();
    bad_spells = ["Negation Source", "Chronostasis", "Agents of Chaos",  "Chaotic Buster"];
    $.each(spells, function(index, value) {
      name = value.displayName;
      if ($.inArray(name, bad_spells) == -1) {
        id = value.skillID;
        lname = name.replace(/\s/g, "");
        lname = lname.toLowerCase();
        h = h + "<span id=\"arcana-"+ lname + "\" class=\"infoclass arcana\">        <img data-id=\"" + id + "\" src=\"img/arcana/"+ name +".png\" />      </span>"
        arr[id] = value;
      }
    });
    $('#div-tabs-arcana').html(h);

    return arr;
  }

  function buildStore(prices) {
    var arr = {};
    $.each(prices, function(index, value) {
      arr[value.name] = value;
    });
    return arr;
  }

  function calcUnlockPrice(id) {
    var tier = getItemTier(id);
    cost = storeArray[id].price + ((tier + 1) * 4)
    return (cost < 10) ? 10 : cost;
  }
  function calcShopPrice(id) {
    return storeArray[id].price * 25;
  }
  function displayItems(ele, items) {
    eleID = ele.children()[0].dataset.id;

    if ($.inArray(eleID, items)) {
      name = items[eleID].displayName;
      id = items[eleID].itemID;
      desc = items[eleID].description;
      h = "<div id=\"relic-pic-" + id + "\" class=\"relic relic-pic\"><img src=\"img/relics/" + name + ".png\" /></div>";
      h = h + "<div id=\"relic-name-" + id + "\" class=\"relic relic-name\"><strong>Name</strong>: " + name + "</div>";
      h = h + "<div id=\"relic-desc-" + id + "\" class=\"relic relic-desc\"><strong>Description</strong>: " + desc + "</div>";
      if (items[eleID].details) {
        h = h + "<div id=\"relic-det-" + id + "\" class=\"relic relic-det\"><strong>Details</strong>: " + items[eleID].details + "</div>";
      }
      if (storeArray[eleID]) {
        h = h + "<div id=\"relic-price-" + id + "\" class=\"relic relic-price\"><strong>Base Price</strong>: " + storeArray[eleID].price + "</div>";
        h = h + "<div id=\"relic-unlockprice-" + id + "\" class=\"relic relic-unlockprice\"><strong>Unlock Price</strong>: " + calcUnlockPrice(eleID) + "<img class=\"chaos\" src=\"img/Chaos.png\" /></div>";
        h = h + "<div id=\"relic-shopprice-" + id + "\" class=\"relic relic-shopprice\"><strong>Shop Price</strong>: " + calcShopPrice(eleID) + "<img class=\"gold\" src=\"img/Gold.png\" /></div>";
      }
      h = h + "<div id=\"relic-id\"" + id + "\" class=\"relic relic-id\"><strong>ID</strong>: " + id + "</div>";

      $("#display").html(h);
    }
  }

  function displaySpells(ele, spells) {
    eleID = ele.children()[0].dataset.id;
    if ($.inArray(eleID, spells)) {
      name = spells[eleID].displayName;
      id = spells[eleID].skillID;
      desc = spells[eleID].description;
      empowered = spells[eleID].empowered;
      h = "<div id=\"spell-name-" + id + "\" class=\"spell spell-name\"><strong>Name</strong>: " + name + "</div>" +
          "<div id=\"spell-desc-" + id + "\" class=\"spell spell-desc\"><strong>Description</strong>: " + desc + "</div>" +
          "<div id=\"spell-emp-" + id + "\" class=\"spell spell-emp\"><strong>Empowered</strong>: " + empowered + "</div>" +
          "<div id=\"spell-id\"" + id + "\" class=\"spell spell-id\"><strong>ID</strong>: " + id + "</div>";
      $("#display").html(h);
    }
  }


  $.ajaxSetup({
    async: false
  });

  initData();
  itemsArray = buildItems(itemsInfo);
  skillsArray = buildArcana(skillsInfo);
  storeArray = buildStore(storeInfo);

  $("#div-tabs-arcana").tabs();
  $("#div-tabs-relics").tabs();
  $("#div-tabs-droprates").tabs();

  $(".relics").mouseover(function() {
    displayItems($(this), itemsArray);
  });
  $(".arcana").mouseover(function() {
    displaySpells($(this), skillsArray);
  });

  $(".infoclass").mouseleave(function() {
  //  $("#display").html("");
  });
});
