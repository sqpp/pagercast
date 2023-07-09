<template>
  <table
    class="hidden border border-separate border-gray-900 shadow table-auto md:block xl:table-fixed xl:max-w-7xl border-spacing-2">
    <thead class="border ">
      <tr class="bg-gray-900 ">
        <th class="inline-block w-24 px-1 text-left truncate md:w-40">Phone Number</th>
        <th class="px-1 text-left md:w-32 ">Name</th>
        <th class="px-1 text-left md:w-32">Country</th>
        <th class="px-1 text-left md:w-32">Network</th>
        <th class="px-1 text-left md:w-32">Active</th>
        <th class="px-1 text-left md:w-32">Last Seen</th>
      </tr>
    </thead>
    <tbody> 
      <tr v-for="number in publicNumbers" :key="number.id">
        <td :class="number.premium ? `text-yellow-300 font-medium before:content-['⭐']` : 'text-gray-300'" class="justify-center px-1 ">{{ number.phone }}</td>
        <td class="inline-block w-24 px-1 truncate md:w-32">{{ number.owner_name }}</td>
        <td>{{ number.country }}</td>
        <td class="inline-block w-16 px-1 truncate md:w-32">{{ number.network_name }}</td>
        <td>
          <span :class="{
            'inline-flex px-1 text-green-500 rounded-md bg-green-500/30': number.status,
            'inline-flex px-1 text-red-500 rounded-md bg-red-500/30': !number.status
          }">
            {{ getOnlineStatus(number.status) }}
          </span>
        </td>
        <td>
          <span>
            <span></span>
          </span>
        </td>
      </tr>
    </tbody>
  </table>

  <div class="w-full mx-4 md:hidden">
  <div class="grid w-full grid-cols-1 gap-4 mx-auto mt-4 text-center text-white md:hidden" v-for="number in publicNumbers" :key="number.id">
      <div class="flex flex-col h-16 bg-gray-900 rounded-md"
        :class="{ 'border-l-8 border-green-500': number.status, 'border-l-8 border-red-500': !number.status }">
        <div class="flex items-center justify-between mx-2 mt-2">
          <div class="flex flex-col items-start">
            <div><span class="select-none">+</span>{{ number.phone }}</div>
            <div class="text-xs">{{ number.owner_name }}</div>
          </div>
          <div class="flex flex-col items-end mt-1">
            <div class="mb-1 text-xs">{{ number.network_name }}</div>
            <img class="w-6 h-4 border border-gray-300"
            :src="'https://flagcdn.com/h20/' + number.country.toLowerCase() + '.png'" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { socket } from "@/socket";
import * as moment from 'moment';

interface NumberData {
  id: string;
  phone: string;
  owner_name: string;
  country: string;
  network_name: string;
  status: boolean;
  premium: boolean;
  lastseen: Date;
}

export default {
  data() {
    return {
      publicNumbers: [] as NumberData[]
    };
  },
  methods: {
    fetchDevices() {
      socket.emit("listDatabase");
      socket.on("showPublicNumbers", (numberList) => {
        console.log(numberList); // Verify that the number list is received correctly
        this.publicNumbers = numberList; // Assign the received number list to the publicNumbers property
      });
    },
    getOnlineStatus(status: boolean): string {
      return status ? "Online" : "Offline";
    },
  },
  mounted() {
    this.fetchDevices(); // Fetch devices when the component is mounted
  }
};
</script>