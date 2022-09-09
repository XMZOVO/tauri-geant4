<template>
  <div class="space-y-5 px-10 py-6">
    <div class="flex items-center gap-5">
      <!--  -->

      <button
        id="dropdownDefault"
        data-dropdown-toggle="dropdown"
        class="inline-flex items-center rounded-lg bg-blue-700 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
      >
        Dropdown button
        <svg
          class="ml-2 h-4 w-4"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>
      <!-- Dropdown menu -->
      <div
        id="dropdown"
        class="z-10 hidden w-44 divide-y divide-gray-100 rounded bg-white shadow dark:bg-gray-700"
        style="
          position: absolute;
          inset: 0px auto auto 0px;
          margin: 0px;
          transform: translate3d(0px, 344.5px, 0px);
        "
        data-popper-reference-hidden=""
        data-popper-escaped=""
        data-popper-placement="bottom"
      >
        <ul
          class="py-1 text-sm text-gray-700 dark:text-gray-200"
          aria-labelledby="dropdownDefault"
        >
          <li>
            <a
              href="#"
              class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >Dashboard</a
            >
          </li>
          <li>
            <a
              href="#"
              class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >Settings</a
            >
          </li>
          <li>
            <a
              href="#"
              class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >Earnings</a
            >
          </li>
          <li>
            <a
              href="#"
              class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >Sign out</a
            >
          </li>
        </ul>
      </div>

      <!--  -->
      <div class="form-control">
        <div class="input-group">
          <input
            type="text"
            placeholder="搜索内容或标题"
            class="input input-bordered focus:outline-none"
          />
          <button class="btn btn-square">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div class="w-full overflow-x-auto">
      <table class="table w-full">
        <!-- head -->
        <thead>
          <tr>
            <th>
              <label>
                <input type="checkbox" class="checkbox" />
              </label>
            </th>
            <th>名称</th>
            <th>探测器类型</th>
            <th>时间</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <!-- row 1 -->
          <tr class="hover cursor-pointer">
            <th>
              <label>
                <input type="checkbox" class="checkbox" />
              </label>
            </th>
            <td>
              <div class="flex items-center space-x-3">
                <div class="avatar">
                  <div class="mask mask-squircle h-12 w-12">
                    <img
                      src="../assets/zhouzhou.jpeg"
                      alt="Avatar Tailwind CSS Component"
                    />
                  </div>
                </div>
                <div>
                  <div class="font-bold">Gean4模拟</div>
                  <div class="text-sm opacity-50">test1</div>
                </div>
              </div>
            </td>
            <td>
              NaI探测器
              <br />
              <span class="badge badge-ghost badge-sm">多参数...</span>
            </td>
            <td>{{ timeNow }}</td>
            <th>
              <button
                class="btn btn-ghost btn-xs hover:bg-transparent hover:text-primary"
              >
                编辑
              </button>
            </th>
          </tr>
        </tbody>
        <!-- foot -->
        <tfoot>
          <tr>
            <th></th>
            <th>名称</th>
            <th>探测器类型</th>
            <th>时间</th>
            <th></th>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue";

const timeNow = ref("");

onMounted(() => {
  getISOTime();
});

const getISOTime = () => {
  let time = new Date();
  time.setHours(time.getHours() + 8);
  let timeString: string = time.toISOString();
  timeString = timeString.replace("T", " ");
  timeString = timeString.substring(0, 19);

  timeNow.value = timeString;
};
</script>
