<template>
  <table class="border border-separate border-gray-900 shadow table-auto border-spacing-2">
    <thead class="border ">
      <tr class="bg-gray-900 ">
        <th class="inline-block w-24 px-1 text-left truncate md:w-40">Phone Number</th>
        <th class="px-1 text-left md:w-40 ">Name</th>
        <th class="px-1 text-left md:w-40">Country</th>
        <th class="px-1 text-left md:w-40">Network</th>
        <th class="px-1 text-left md:w-40">Active</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="number in publicNumbers" :key="number.id">
        <td class="px-1 ">{{ number.phone }}</td>
        <td class="inline-block w-24 px-1 truncate md:w-64">{{ number.owner_name }}</td>
        <td>{{ number.country }}</td>
        <td class="inline-block w-16 px-1 truncate md:w-64">{{ number.network_name }}</td>
        <td>
          <span :class="{
            'inline-flex px-1 text-green-500 rounded-md bg-green-500/30': number.status,
            'inline-flex px-1 text-red-500 rounded-md bg-red-500/30': !number.status
          }">
            {{ getOnlineStatus(number.status) }}
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { socket } from "@/socket";
interface NumberData {
  id: string;
  phone: string;
  owner_name: string;
  country: string;
  network_name: string;
  status: boolean;
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
    }
  },
  mounted() {
    this.fetchDevices(); // Fetch devices when the component is mounted
  }
};
</script>