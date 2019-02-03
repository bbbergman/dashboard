import { Component, OnInit } from '@angular/core';
import * as data from '../../assets/ex_data.json';
import {HttpService} from '../../httpService.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  data = data;
  protocols; times; deviceGroups; deviceGroup1; deviceGroup2; deviceGroup3
  deviceGroupsArray = [];
  overallActiveDevicesCounter = 0;
  protocolsCounter = 0;
  selectedTime;
  deviceChosen = true;
  protocolChosen = false;
  timeChosen = false;
  constructor(private httpService: HttpService) { }
  ngOnInit() {
    this.getData();
    this.initDeviceCounter(this.deviceGroupsArray[0]);
    this.initDeviceCounter(this.deviceGroupsArray[1]);
    this.initDeviceCounter(this.deviceGroupsArray[2]);
  }
  getData() {
    this.deviceGroups = this.data['default'][0]['device_groups'];
    this.deviceGroup1 = this.deviceGroups[0]['devices'];
    this.deviceGroupsArray.push(this.deviceGroup1);
    this.deviceGroup2 = this.deviceGroups[1]['devices'];
    this.deviceGroupsArray.push(this.deviceGroup2);
    this.deviceGroup3 = this.deviceGroups[2]['devices'];
    this.deviceGroupsArray.push(this.deviceGroup3);
    /// adds new fields to each device array
    this.deviceGroupsArray.forEach(function(deviceGroup) {
      deviceGroup.groupElementsCounter = 0;
      deviceGroup.groupActiveCounter = 0;
      deviceGroup.groupAllActive = false;
    });
    this.protocols = this.data['default'][0]['protocols'];
    /// adds new 'active' field to each protocol
    this.protocols.forEach(function(protocol) {
      protocol.active = 0;
    });
    this.times = this.data['default'][0]['times'];
  }
  initDeviceCounter(deviceArray) {
    for (const device of deviceArray) {
      deviceArray.groupElementsCounter++;
      if (device.active === 1) {
        deviceArray.groupActiveCounter++;
        this.overallActiveDevicesCounter++;
      }
    }
    if (deviceArray.groupElementsCounter === deviceArray.groupActiveCounter) {
      deviceArray.groupAllActive = true;
    }
  }
  checkboxClicked(arrayIndex, i) {
    const deviceArray = this.deviceGroupsArray[arrayIndex];
    deviceArray[i].active = 1 -  deviceArray[i].active;
    if (deviceArray[i].active === 1) {
      deviceArray.groupActiveCounter++;
      this.overallActiveDevicesCounter++;
      if (this.overallActiveDevicesCounter === 1) {
        this.deviceChosen = true;
      }
      if (deviceArray.groupElementsCounter === deviceArray.groupActiveCounter) {
        deviceArray.groupAllActive = true;
      }
    } else {
      deviceArray.groupActiveCounter--;
      this.overallActiveDevicesCounter--;
      if (this.overallActiveDevicesCounter === 0) {
        this.deviceChosen = false;
      }
      if (deviceArray.groupElementsCounter !== deviceArray.groupActiveCounter) {
        deviceArray.groupAllActive = false;
      }
    }
  }
  groupSelected(arrayIndex) {
    const deviceArray = this.deviceGroupsArray[arrayIndex];
    for (const device of deviceArray) {
      if (device.active === 0) {
        device.active = 1;
        this.overallActiveDevicesCounter++;
      }
    }
    deviceArray.groupActiveCounter = deviceArray.groupElementsCounter;
    deviceArray.groupAllActive = true;
    this.deviceChosen = true;
  }
  protocolClicked(i) {
    this.protocols[i].active = 1 -  this.protocols[i].active;
    if (this.protocols[i].active === 1) {
      this.protocolsCounter++;
      if (this.protocolsCounter === 1) {
        this.protocolChosen = true;
      }
    } else {
      this.protocolsCounter--;
      if (this.protocolsCounter === 0) {
        this.protocolChosen = false;
      }
    }
  }
  timeChecked(i) {
    this.timeChosen = true;
    this.selectedTime = this.times[i];
  }
  submit() {
    if (this.deviceChosen && this.protocolChosen && this.timeChosen) {
      const stringToSend = this.makeStringForSend();
      const stringResult = this.httpService.getData(stringToSend)
        .subscribe(answer => {console.log(answer); },
          error => console.log(error));
    }
  }
  makeStringForSend(): string {
    let stringToSend = 'ex.html?devices=';
    this.deviceGroup1.forEach(function(device1) {
      if (device1.active === 1) {
        stringToSend = stringToSend +  device1.id + ',';
      }
    });
    this.deviceGroup2.forEach(function(device2) {
      if (device2.active === 1) {
        stringToSend = stringToSend +  device2.id + ',';
      }
    });
    this.deviceGroup3.forEach(function(device3) {
      if (device3.active === 1) {
        stringToSend = stringToSend +  device3.id + ',';
      }
    });
    stringToSend = stringToSend.slice(0, -1);
    stringToSend += '&protocols=';
    this.protocols.forEach(function(protocol) {
      if (protocol.active === 1) {
        stringToSend = stringToSend +  protocol.id + ',';
      }
    });
    stringToSend = stringToSend.slice(0, -1);
    stringToSend += '&times=';
    stringToSend = stringToSend + this.selectedTime.id;
    return stringToSend;
  }
  clear() {
    this.clearDevices();
    this.clearProtocols();
    this.clearTime();
  }
  clearDevices() {
    this.deviceGroupsArray.forEach(function(deviceGroup) {
      deviceGroup.forEach(function(device1) {
        device1.active = 0;
      });
      deviceGroup.groupActiveCounter = 0;
      deviceGroup.groupAllActive = false;
    });
    this.overallActiveDevicesCounter = 0;
    this.deviceChosen = false;
  }
  clearProtocols() {
    this.protocols.forEach(function(protocol) {
      protocol.active = 0;
    });
    this.protocolsCounter = 0;
    this.protocolChosen = false;
  }
  clearTime() {
    const elements = document.getElementsByTagName('input');
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].type === 'radio') {
        elements[i].checked = false ;
      }
    }
    this.timeChosen = false;
  }
}
