(module
  (type (;0;) (func (param i32) (result i32)))
  (type (;1;) (func (param i32 i32) (result i32)))
  (type (;2;) (func (param i32 i32)))
  (type (;3;) (func (param i32 i32 i32)))
  (type (;4;) (func (param i32 i32 i32) (result i32)))
  (type (;5;) (func))
  (type (;6;) (func (result i32)))
  (type (;7;) (func (param i32 i32 i32 i32)))
  (type (;8;) (func (param i32)))
  (type (;9;) (func (param i32 i32 i32 i32 i32 i32 i32)))
  (type (;10;) (func (param i32 i32 i32 i32) (result i32)))
  (import "env" "abort" (func $~lib/builtins/abort (type 7)))
  (import "conversion" "typeConversion.stringToH160" (func $~lib/@graphprotocol/graph-ts/common/conversion/typeConversion.stringToH160 (type 0)))
  (import "store" "clearStore" (func $~lib/matchstick-as/assembly/store/clearStore (type 5)))
  (import "index" "_registerHook" (func $~lib/matchstick-as/assembly/index/_registerHook (type 2)))
  (import "conversion" "typeConversion.bytesToHex" (func $~lib/@graphprotocol/graph-ts/common/conversion/typeConversion.bytesToHex (type 0)))
  (import "index" "log.log" (func $~lib/@graphprotocol/graph-ts/index/log.log (type 2)))
  (import "index" "store.get" (func $~lib/@graphprotocol/graph-ts/index/store.get (type 1)))
  (import "numbers" "bigDecimal.toString" (func $~lib/@graphprotocol/graph-ts/common/numbers/bigDecimal.toString (type 0)))
  (import "conversion" "typeConversion.bigIntToString" (func $~lib/@graphprotocol/graph-ts/common/conversion/typeConversion.bigIntToString (type 0)))
  (import "index" "store.set" (func $~lib/@graphprotocol/graph-ts/index/store.set (type 3)))
  (import "datasource" "dataSource.network" (func $~lib/@graphprotocol/graph-ts/common/datasource/dataSource.network (type 6)))
  (import "numbers" "bigInt.plus" (func $~lib/@graphprotocol/graph-ts/common/numbers/bigInt.plus (type 1)))
  (import "assert" "_assert.fieldEquals" (func $~lib/matchstick-as/assembly/assert/_assert.fieldEquals (type 10)))
  (import "index" "_registerTest" (func $~lib/matchstick-as/assembly/index/_registerTest (type 3)))
  (import "index" "_registerDescribe" (func $~lib/matchstick-as/assembly/index/_registerDescribe (type 2)))
  (func $~lib/rt/stub/__alloc (type 0) (param i32) (result i32)
    (local i32 i32 i32 i32 i32)
    local.get 0
    i32.const 1073741820
    i32.gt_u
    if  ;; label = @1
      i32.const 1056
      i32.const 1120
      i32.const 33
      i32.const 29
      call $~lib/builtins/abort
      unreachable
    end
    global.get $~lib/rt/stub/offset
    local.tee 1
    i32.const 4
    i32.add
    local.tee 2
    local.get 0
    i32.const 19
    i32.add
    i32.const -16
    i32.and
    i32.const 4
    i32.sub
    local.tee 0
    i32.add
    local.tee 3
    memory.size
    local.tee 4
    i32.const 16
    i32.shl
    i32.const 15
    i32.add
    i32.const -16
    i32.and
    local.tee 5
    i32.gt_u
    if  ;; label = @1
      local.get 4
      local.get 3
      local.get 5
      i32.sub
      i32.const 65535
      i32.add
      i32.const -65536
      i32.and
      i32.const 16
      i32.shr_u
      local.tee 5
      local.get 4
      local.get 5
      i32.gt_s
      select
      memory.grow
      i32.const 0
      i32.lt_s
      if  ;; label = @2
        local.get 5
        memory.grow
        i32.const 0
        i32.lt_s
        if  ;; label = @3
          unreachable
        end
      end
    end
    local.get 3
    global.set $~lib/rt/stub/offset
    local.get 1
    local.get 0
    i32.store
    local.get 2)
  (func $~lib/rt/stub/__new (type 1) (param i32 i32) (result i32)
    (local i32 i32)
    local.get 0
    i32.const 1073741804
    i32.gt_u
    if  ;; label = @1
      i32.const 1056
      i32.const 1120
      i32.const 86
      i32.const 30
      call $~lib/builtins/abort
      unreachable
    end
    local.get 0
    i32.const 16
    i32.add
    call $~lib/rt/stub/__alloc
    local.tee 3
    i32.const 4
    i32.sub
    local.tee 2
    i32.const 0
    i32.store offset=4
    local.get 2
    i32.const 0
    i32.store offset=8
    local.get 2
    local.get 1
    i32.store offset=12
    local.get 2
    local.get 0
    i32.store offset=16
    local.get 3
    i32.const 16
    i32.add)
  (func $~lib/memory/memory.fill (type 2) (param i32 i32)
    (local i32)
    block  ;; label = @1
      local.get 1
      i32.eqz
      br_if 0 (;@1;)
      local.get 0
      i32.const 0
      i32.store8
      local.get 0
      local.get 1
      i32.add
      local.tee 2
      i32.const 1
      i32.sub
      i32.const 0
      i32.store8
      local.get 1
      i32.const 2
      i32.le_u
      br_if 0 (;@1;)
      local.get 0
      i32.const 0
      i32.store8 offset=1
      local.get 0
      i32.const 0
      i32.store8 offset=2
      local.get 2
      i32.const 2
      i32.sub
      i32.const 0
      i32.store8
      local.get 2
      i32.const 3
      i32.sub
      i32.const 0
      i32.store8
      local.get 1
      i32.const 6
      i32.le_u
      br_if 0 (;@1;)
      local.get 0
      i32.const 0
      i32.store8 offset=3
      local.get 2
      i32.const 4
      i32.sub
      i32.const 0
      i32.store8
      local.get 1
      i32.const 8
      i32.le_u
      br_if 0 (;@1;)
      local.get 0
      i32.const 0
      local.get 0
      i32.sub
      i32.const 3
      i32.and
      local.tee 2
      i32.add
      local.tee 0
      i32.const 0
      i32.store
      local.get 0
      local.get 1
      local.get 2
      i32.sub
      i32.const -4
      i32.and
      local.tee 1
      i32.add
      local.tee 2
      i32.const 4
      i32.sub
      i32.const 0
      i32.store
      local.get 1
      i32.const 8
      i32.le_u
      br_if 0 (;@1;)
      local.get 0
      i32.const 0
      i32.store offset=4
      local.get 0
      i32.const 0
      i32.store offset=8
      local.get 2
      i32.const 12
      i32.sub
      i32.const 0
      i32.store
      local.get 2
      i32.const 8
      i32.sub
      i32.const 0
      i32.store
      local.get 1
      i32.const 24
      i32.le_u
      br_if 0 (;@1;)
      local.get 0
      i32.const 0
      i32.store offset=12
      local.get 0
      i32.const 0
      i32.store offset=16
      local.get 0
      i32.const 0
      i32.store offset=20
      local.get 0
      i32.const 0
      i32.store offset=24
      local.get 2
      i32.const 28
      i32.sub
      i32.const 0
      i32.store
      local.get 2
      i32.const 24
      i32.sub
      i32.const 0
      i32.store
      local.get 2
      i32.const 20
      i32.sub
      i32.const 0
      i32.store
      local.get 2
      i32.const 16
      i32.sub
      i32.const 0
      i32.store
      local.get 0
      local.get 0
      i32.const 4
      i32.and
      i32.const 24
      i32.add
      local.tee 2
      i32.add
      local.set 0
      local.get 1
      local.get 2
      i32.sub
      local.set 1
      loop  ;; label = @2
        local.get 1
        i32.const 32
        i32.ge_u
        if  ;; label = @3
          local.get 0
          i64.const 0
          i64.store
          local.get 0
          i64.const 0
          i64.store offset=8
          local.get 0
          i64.const 0
          i64.store offset=16
          local.get 0
          i64.const 0
          i64.store offset=24
          local.get 1
          i32.const 32
          i32.sub
          local.set 1
          local.get 0
          i32.const 32
          i32.add
          local.set 0
          br 1 (;@2;)
        end
      end
    end)
  (func $~lib/@graphprotocol/graph-ts/common/collections/Entity#constructor (type 0) (param i32) (result i32)
    (local i32 i32)
    local.get 0
    i32.eqz
    if  ;; label = @1
      i32.const 4
      i32.const 5
      call $~lib/rt/stub/__new
      local.set 0
    end
    local.get 0
    i32.eqz
    if  ;; label = @1
      i32.const 4
      i32.const 7
      call $~lib/rt/stub/__new
      local.set 0
    end
    local.get 0
    i32.const 0
    i32.store
    i32.const 16
    i32.const 9
    call $~lib/rt/stub/__new
    local.tee 1
    i32.const 0
    i32.store
    local.get 1
    i32.const 0
    i32.store offset=4
    local.get 1
    i32.const 0
    i32.store offset=8
    local.get 1
    i32.const 0
    i32.store offset=12
    i32.const 32
    i32.const 0
    call $~lib/rt/stub/__new
    local.tee 2
    i32.const 32
    call $~lib/memory/memory.fill
    local.get 1
    local.get 2
    i32.store
    local.get 1
    local.get 2
    i32.store offset=4
    local.get 1
    i32.const 32
    i32.store offset=8
    local.get 1
    i32.const 0
    i32.store offset=12
    local.get 0
    local.get 1
    i32.store
    local.get 0)
  (func $~lib/@graphprotocol/graph-ts/common/collections/ByteArray#constructor (type 1) (param i32 i32) (result i32)
    (local i32)
    local.get 0
    i32.eqz
    if  ;; label = @1
      i32.const 12
      i32.const 12
      call $~lib/rt/stub/__new
      local.set 0
    end
    local.get 0
    i32.eqz
    if  ;; label = @1
      i32.const 12
      i32.const 13
      call $~lib/rt/stub/__new
      local.set 0
    end
    local.get 0
    i32.eqz
    if  ;; label = @1
      i32.const 12
      i32.const 2
      call $~lib/rt/stub/__new
      local.set 0
    end
    local.get 0
    i32.const 0
    i32.store
    local.get 0
    i32.const 0
    i32.store offset=4
    local.get 0
    i32.const 0
    i32.store offset=8
    local.get 1
    i32.const 1073741820
    i32.gt_u
    if  ;; label = @1
      i32.const 1728
      i32.const 1936
      i32.const 19
      i32.const 57
      call $~lib/builtins/abort
      unreachable
    end
    local.get 1
    i32.const 0
    call $~lib/rt/stub/__new
    local.tee 2
    local.get 1
    call $~lib/memory/memory.fill
    local.get 0
    local.get 2
    i32.store
    local.get 0
    local.get 2
    i32.store offset=4
    local.get 0
    local.get 1
    i32.store offset=8
    local.get 0)
  (func $~lib/typedarray/Uint8Array#__set (type 3) (param i32 i32 i32)
    local.get 0
    i32.load offset=8
    local.get 1
    i32.le_u
    if  ;; label = @1
      i32.const 2000
      i32.const 2064
      i32.const 177
      i32.const 45
      call $~lib/builtins/abort
      unreachable
    end
    local.get 1
    local.get 0
    i32.load offset=4
    i32.add
    local.get 2
    i32.store8)
  (func $~lib/@graphprotocol/graph-ts/common/collections/ByteArray.fromI32 (type 0) (param i32) (result i32)
    (local i32)
    i32.const 0
    i32.const 4
    call $~lib/@graphprotocol/graph-ts/common/collections/ByteArray#constructor
    local.tee 1
    i32.const 0
    local.get 0
    i32.const 255
    i32.and
    call $~lib/typedarray/Uint8Array#__set
    local.get 1
    i32.const 1
    local.get 0
    i32.const 8
    i32.shr_s
    i32.const 255
    i32.and
    call $~lib/typedarray/Uint8Array#__set
    local.get 1
    i32.const 2
    local.get 0
    i32.const 16
    i32.shr_s
    i32.const 255
    i32.and
    call $~lib/typedarray/Uint8Array#__set
    local.get 1
    i32.const 3
    local.get 0
    i32.const 24
    i32.shr_s
    call $~lib/typedarray/Uint8Array#__set
    local.get 1)
  (func $~lib/array/Array<~lib/@graphprotocol/graph-ts/common/collections/TypedMapEntry<~lib/string/String_~lib/string/String>>#__get (type 1) (param i32 i32) (result i32)
    local.get 0
    i32.load offset=12
    local.get 1
    i32.le_u
    if  ;; label = @1
      i32.const 2000
      i32.const 1776
      i32.const 114
      i32.const 42
      call $~lib/builtins/abort
      unreachable
    end
    local.get 0
    i32.load offset=4
    local.get 1
    i32.const 2
    i32.shl
    i32.add
    i32.load
    local.tee 0
    i32.eqz
    if  ;; label = @1
      i32.const 3552
      i32.const 1776
      i32.const 118
      i32.const 40
      call $~lib/builtins/abort
      unreachable
    end
    local.get 0)
  (func $~lib/string/String.__eq (type 1) (param i32 i32) (result i32)
    (local i32 i32 i32 i32)
    local.get 0
    local.get 1
    i32.eq
    if  ;; label = @1
      i32.const 1
      return
    end
    local.get 1
    i32.const 0
    local.get 0
    select
    i32.eqz
    if  ;; label = @1
      i32.const 0
      return
    end
    local.get 0
    i32.const 20
    i32.sub
    i32.load offset=16
    i32.const 1
    i32.shr_u
    local.tee 3
    local.get 1
    i32.const 20
    i32.sub
    i32.load offset=16
    i32.const 1
    i32.shr_u
    i32.ne
    if  ;; label = @1
      i32.const 0
      return
    end
    local.get 0
    local.tee 2
    i32.const 7
    i32.and
    local.get 1
    i32.const 7
    i32.and
    i32.or
    i32.eqz
    local.get 3
    local.tee 0
    i32.const 4
    i32.ge_u
    i32.and
    if  ;; label = @1
      loop  ;; label = @2
        local.get 2
        i64.load
        local.get 1
        i64.load
        i64.eq
        if  ;; label = @3
          local.get 2
          i32.const 8
          i32.add
          local.set 2
          local.get 1
          i32.const 8
          i32.add
          local.set 1
          local.get 0
          i32.const 4
          i32.sub
          local.tee 0
          i32.const 4
          i32.ge_u
          br_if 1 (;@2;)
        end
      end
    end
    block  ;; label = @1
      loop  ;; label = @2
        local.get 0
        local.tee 3
        i32.const 1
        i32.sub
        local.set 0
        local.get 3
        if  ;; label = @3
          local.get 2
          i32.load16_u
          local.tee 5
          local.get 1
          i32.load16_u
          local.tee 4
          i32.sub
          local.set 3
          local.get 4
          local.get 5
          i32.ne
          br_if 2 (;@1;)
          local.get 2
          i32.const 2
          i32.add
          local.set 2
          local.get 1
          i32.const 2
          i32.add
          local.set 1
          br 1 (;@2;)
        end
      end
      i32.const 0
      local.set 3
    end
    local.get 3
    i32.eqz)
  (func $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/string/String>#getEntry (type 1) (param i32 i32) (result i32)
    (local i32)
    loop  ;; label = @1
      local.get 0
      i32.load
      i32.load offset=12
      local.get 2
      i32.gt_s
      if  ;; label = @2
        local.get 0
        i32.load
        local.get 2
        call $~lib/array/Array<~lib/@graphprotocol/graph-ts/common/collections/TypedMapEntry<~lib/string/String_~lib/string/String>>#__get
        i32.load
        local.get 1
        call $~lib/string/String.__eq
        if  ;; label = @3
          local.get 0
          i32.load
          local.get 2
          call $~lib/array/Array<~lib/@graphprotocol/graph-ts/common/collections/TypedMapEntry<~lib/string/String_~lib/string/String>>#__get
          return
        end
        local.get 2
        i32.const 1
        i32.add
        local.set 2
        br 1 (;@1;)
      end
    end
    i32.const 0)
  (func $~lib/util/memory/memcpy (type 3) (param i32 i32 i32)
    (local i32 i32 i32)
    loop  ;; label = @1
      local.get 1
      i32.const 3
      i32.and
      i32.const 0
      local.get 2
      select
      if  ;; label = @2
        local.get 0
        local.tee 3
        i32.const 1
        i32.add
        local.set 0
        local.get 1
        local.tee 4
        i32.const 1
        i32.add
        local.set 1
        local.get 3
        local.get 4
        i32.load8_u
        i32.store8
        local.get 2
        i32.const 1
        i32.sub
        local.set 2
        br 1 (;@1;)
      end
    end
    local.get 0
    i32.const 3
    i32.and
    i32.eqz
    if  ;; label = @1
      loop  ;; label = @2
        local.get 2
        i32.const 16
        i32.ge_u
        if  ;; label = @3
          local.get 0
          local.get 1
          i32.load
          i32.store
          local.get 0
          local.get 1
          i32.load offset=4
          i32.store offset=4
          local.get 0
          local.get 1
          i32.load offset=8
          i32.store offset=8
          local.get 0
          local.get 1
          i32.load offset=12
          i32.store offset=12
          local.get 1
          i32.const 16
          i32.add
          local.set 1
          local.get 0
          i32.const 16
          i32.add
          local.set 0
          local.get 2
          i32.const 16
          i32.sub
          local.set 2
          br 1 (;@2;)
        end
      end
      local.get 2
      i32.const 8
      i32.and
      if  ;; label = @2
        local.get 0
        local.get 1
        i32.load
        i32.store
        local.get 0
        local.get 1
        i32.load offset=4
        i32.store offset=4
        local.get 1
        i32.const 8
        i32.add
        local.set 1
        local.get 0
        i32.const 8
        i32.add
        local.set 0
      end
      local.get 2
      i32.const 4
      i32.and
      if  ;; label = @2
        local.get 0
        local.get 1
        i32.load
        i32.store
        local.get 1
        i32.const 4
        i32.add
        local.set 1
        local.get 0
        i32.const 4
        i32.add
        local.set 0
      end
      local.get 2
      i32.const 2
      i32.and
      if  ;; label = @2
        local.get 0
        local.get 1
        i32.load16_u
        i32.store16
        local.get 1
        i32.const 2
        i32.add
        local.set 1
        local.get 0
        i32.const 2
        i32.add
        local.set 0
      end
      local.get 2
      i32.const 1
      i32.and
      if  ;; label = @2
        local.get 0
        local.get 1
        i32.load8_u
        i32.store8
      end
      return
    end
    local.get 2
    i32.const 32
    i32.ge_u
    if  ;; label = @1
      block  ;; label = @2
        block  ;; label = @3
          block  ;; label = @4
            block  ;; label = @5
              local.get 0
              i32.const 3
              i32.and
              i32.const 1
              i32.sub
              br_table 0 (;@5;) 1 (;@4;) 2 (;@3;) 3 (;@2;)
            end
            local.get 1
            i32.load
            local.set 5
            local.get 0
            local.get 1
            i32.load8_u
            i32.store8
            local.get 0
            local.get 1
            i32.load8_u offset=1
            i32.store8 offset=1
            local.get 0
            i32.const 2
            i32.add
            local.tee 3
            i32.const 1
            i32.add
            local.set 0
            local.get 1
            i32.const 2
            i32.add
            local.tee 4
            i32.const 1
            i32.add
            local.set 1
            local.get 3
            local.get 4
            i32.load8_u
            i32.store8
            local.get 2
            i32.const 3
            i32.sub
            local.set 2
            loop  ;; label = @5
              local.get 2
              i32.const 17
              i32.ge_u
              if  ;; label = @6
                local.get 0
                local.get 1
                i32.load offset=1
                local.tee 3
                i32.const 8
                i32.shl
                local.get 5
                i32.const 24
                i32.shr_u
                i32.or
                i32.store
                local.get 0
                local.get 1
                i32.load offset=5
                local.tee 4
                i32.const 8
                i32.shl
                local.get 3
                i32.const 24
                i32.shr_u
                i32.or
                i32.store offset=4
                local.get 0
                local.get 1
                i32.load offset=9
                local.tee 3
                i32.const 8
                i32.shl
                local.get 4
                i32.const 24
                i32.shr_u
                i32.or
                i32.store offset=8
                local.get 0
                local.get 1
                i32.load offset=13
                local.tee 5
                i32.const 8
                i32.shl
                local.get 3
                i32.const 24
                i32.shr_u
                i32.or
                i32.store offset=12
                local.get 1
                i32.const 16
                i32.add
                local.set 1
                local.get 0
                i32.const 16
                i32.add
                local.set 0
                local.get 2
                i32.const 16
                i32.sub
                local.set 2
                br 1 (;@5;)
              end
            end
            br 2 (;@2;)
          end
          local.get 1
          i32.load
          local.set 5
          local.get 0
          local.get 1
          i32.load8_u
          i32.store8
          local.get 0
          local.tee 3
          i32.const 2
          i32.add
          local.set 0
          local.get 1
          local.tee 4
          i32.const 2
          i32.add
          local.set 1
          local.get 3
          local.get 4
          i32.load8_u offset=1
          i32.store8 offset=1
          local.get 2
          i32.const 2
          i32.sub
          local.set 2
          loop  ;; label = @4
            local.get 2
            i32.const 18
            i32.ge_u
            if  ;; label = @5
              local.get 0
              local.get 1
              i32.load offset=2
              local.tee 3
              i32.const 16
              i32.shl
              local.get 5
              i32.const 16
              i32.shr_u
              i32.or
              i32.store
              local.get 0
              local.get 1
              i32.load offset=6
              local.tee 4
              i32.const 16
              i32.shl
              local.get 3
              i32.const 16
              i32.shr_u
              i32.or
              i32.store offset=4
              local.get 0
              local.get 1
              i32.load offset=10
              local.tee 3
              i32.const 16
              i32.shl
              local.get 4
              i32.const 16
              i32.shr_u
              i32.or
              i32.store offset=8
              local.get 0
              local.get 1
              i32.load offset=14
              local.tee 5
              i32.const 16
              i32.shl
              local.get 3
              i32.const 16
              i32.shr_u
              i32.or
              i32.store offset=12
              local.get 1
              i32.const 16
              i32.add
              local.set 1
              local.get 0
              i32.const 16
              i32.add
              local.set 0
              local.get 2
              i32.const 16
              i32.sub
              local.set 2
              br 1 (;@4;)
            end
          end
          br 1 (;@2;)
        end
        local.get 1
        i32.load
        local.set 5
        local.get 0
        local.tee 3
        i32.const 1
        i32.add
        local.set 0
        local.get 1
        local.tee 4
        i32.const 1
        i32.add
        local.set 1
        local.get 3
        local.get 4
        i32.load8_u
        i32.store8
        local.get 2
        i32.const 1
        i32.sub
        local.set 2
        loop  ;; label = @3
          local.get 2
          i32.const 19
          i32.ge_u
          if  ;; label = @4
            local.get 0
            local.get 1
            i32.load offset=3
            local.tee 3
            i32.const 24
            i32.shl
            local.get 5
            i32.const 8
            i32.shr_u
            i32.or
            i32.store
            local.get 0
            local.get 1
            i32.load offset=7
            local.tee 4
            i32.const 24
            i32.shl
            local.get 3
            i32.const 8
            i32.shr_u
            i32.or
            i32.store offset=4
            local.get 0
            local.get 1
            i32.load offset=11
            local.tee 3
            i32.const 24
            i32.shl
            local.get 4
            i32.const 8
            i32.shr_u
            i32.or
            i32.store offset=8
            local.get 0
            local.get 1
            i32.load offset=15
            local.tee 5
            i32.const 24
            i32.shl
            local.get 3
            i32.const 8
            i32.shr_u
            i32.or
            i32.store offset=12
            local.get 1
            i32.const 16
            i32.add
            local.set 1
            local.get 0
            i32.const 16
            i32.add
            local.set 0
            local.get 2
            i32.const 16
            i32.sub
            local.set 2
            br 1 (;@3;)
          end
        end
      end
    end
    local.get 2
    i32.const 16
    i32.and
    if  ;; label = @1
      local.get 0
      local.get 1
      i32.load8_u
      i32.store8
      local.get 0
      local.get 1
      i32.load8_u offset=1
      i32.store8 offset=1
      local.get 0
      i32.const 2
      i32.add
      local.tee 0
      local.get 1
      i32.const 2
      i32.add
      local.tee 1
      i32.load8_u
      i32.store8
      local.get 0
      local.get 1
      i32.load8_u offset=1
      i32.store8 offset=1
      local.get 0
      i32.const 2
      i32.add
      local.tee 0
      local.get 1
      i32.const 2
      i32.add
      local.tee 1
      i32.load8_u
      i32.store8
      local.get 0
      local.get 1
      i32.load8_u offset=1
      i32.store8 offset=1
      local.get 0
      i32.const 2
      i32.add
      local.tee 0
      local.get 1
      i32.const 2
      i32.add
      local.tee 1
      i32.load8_u
      i32.store8
      local.get 0
      local.get 1
      i32.load8_u offset=1
      i32.store8 offset=1
      local.get 0
      i32.const 2
      i32.add
      local.tee 0
      local.get 1
      i32.const 2
      i32.add
      local.tee 1
      i32.load8_u
      i32.store8
      local.get 0
      local.get 1
      i32.load8_u offset=1
      i32.store8 offset=1
      local.get 0
      i32.const 2
      i32.add
      local.tee 0
      local.get 1
      i32.const 2
      i32.add
      local.tee 1
      i32.load8_u
      i32.store8
      local.get 0
      local.get 1
      i32.load8_u offset=1
      i32.store8 offset=1
      local.get 0
      i32.const 2
      i32.add
      local.tee 0
      local.get 1
      i32.const 2
      i32.add
      local.tee 1
      i32.load8_u
      i32.store8
      local.get 0
      local.get 1
      i32.load8_u offset=1
      i32.store8 offset=1
      local.get 0
      i32.const 2
      i32.add
      local.tee 0
      local.get 1
      i32.const 2
      i32.add
      local.tee 3
      i32.load8_u
      i32.store8
      local.get 3
      i32.const 2
      i32.add
      local.set 1
      local.get 0
      local.get 3
      i32.load8_u offset=1
      i32.store8 offset=1
      local.get 0
      i32.const 2
      i32.add
      local.set 0
    end
    local.get 2
    i32.const 8
    i32.and
    if  ;; label = @1
      local.get 0
      local.get 1
      i32.load8_u
      i32.store8
      local.get 0
      local.get 1
      i32.load8_u offset=1
      i32.store8 offset=1
      local.get 0
      i32.const 2
      i32.add
      local.tee 0
      local.get 1
      i32.const 2
      i32.add
      local.tee 1
      i32.load8_u
      i32.store8
      local.get 0
      local.get 1
      i32.load8_u offset=1
      i32.store8 offset=1
      local.get 0
      i32.const 2
      i32.add
      local.tee 0
      local.get 1
      i32.const 2
      i32.add
      local.tee 1
      i32.load8_u
      i32.store8
      local.get 0
      local.get 1
      i32.load8_u offset=1
      i32.store8 offset=1
      local.get 0
      i32.const 2
      i32.add
      local.tee 0
      local.get 1
      i32.const 2
      i32.add
      local.tee 3
      i32.load8_u
      i32.store8
      local.get 3
      i32.const 2
      i32.add
      local.set 1
      local.get 0
      local.get 3
      i32.load8_u offset=1
      i32.store8 offset=1
      local.get 0
      i32.const 2
      i32.add
      local.set 0
    end
    local.get 2
    i32.const 4
    i32.and
    if  ;; label = @1
      local.get 0
      local.get 1
      i32.load8_u
      i32.store8
      local.get 0
      local.get 1
      i32.load8_u offset=1
      i32.store8 offset=1
      local.get 0
      i32.const 2
      i32.add
      local.tee 0
      local.get 1
      i32.const 2
      i32.add
      local.tee 3
      i32.load8_u
      i32.store8
      local.get 3
      i32.const 2
      i32.add
      local.set 1
      local.get 0
      local.get 3
      i32.load8_u offset=1
      i32.store8 offset=1
      local.get 0
      i32.const 2
      i32.add
      local.set 0
    end
    local.get 2
    i32.const 2
    i32.and
    if  ;; label = @1
      local.get 0
      local.get 1
      i32.load8_u
      i32.store8
      local.get 0
      local.tee 3
      i32.const 2
      i32.add
      local.set 0
      local.get 1
      local.tee 4
      i32.const 2
      i32.add
      local.set 1
      local.get 3
      local.get 4
      i32.load8_u offset=1
      i32.store8 offset=1
    end
    local.get 2
    i32.const 1
    i32.and
    if  ;; label = @1
      local.get 0
      local.get 1
      i32.load8_u
      i32.store8
    end)
  (func $~lib/memory/memory.copy (type 3) (param i32 i32 i32)
    (local i32 i32)
    block  ;; label = @1
      local.get 2
      local.set 4
      local.get 0
      local.get 1
      i32.eq
      br_if 0 (;@1;)
      local.get 1
      local.get 0
      i32.sub
      local.get 4
      i32.sub
      i32.const 0
      local.get 4
      i32.const 1
      i32.shl
      i32.sub
      i32.le_u
      if  ;; label = @2
        local.get 0
        local.get 1
        local.get 4
        call $~lib/util/memory/memcpy
        br 1 (;@1;)
      end
      local.get 0
      local.get 1
      i32.lt_u
      if  ;; label = @2
        local.get 1
        i32.const 7
        i32.and
        local.get 0
        i32.const 7
        i32.and
        i32.eq
        if  ;; label = @3
          loop  ;; label = @4
            local.get 0
            i32.const 7
            i32.and
            if  ;; label = @5
              local.get 4
              i32.eqz
              br_if 4 (;@1;)
              local.get 4
              i32.const 1
              i32.sub
              local.set 4
              local.get 0
              local.tee 2
              i32.const 1
              i32.add
              local.set 0
              local.get 1
              local.tee 3
              i32.const 1
              i32.add
              local.set 1
              local.get 2
              local.get 3
              i32.load8_u
              i32.store8
              br 1 (;@4;)
            end
          end
          loop  ;; label = @4
            local.get 4
            i32.const 8
            i32.ge_u
            if  ;; label = @5
              local.get 0
              local.get 1
              i64.load
              i64.store
              local.get 4
              i32.const 8
              i32.sub
              local.set 4
              local.get 0
              i32.const 8
              i32.add
              local.set 0
              local.get 1
              i32.const 8
              i32.add
              local.set 1
              br 1 (;@4;)
            end
          end
        end
        loop  ;; label = @3
          local.get 4
          if  ;; label = @4
            local.get 0
            local.tee 2
            i32.const 1
            i32.add
            local.set 0
            local.get 1
            local.tee 3
            i32.const 1
            i32.add
            local.set 1
            local.get 2
            local.get 3
            i32.load8_u
            i32.store8
            local.get 4
            i32.const 1
            i32.sub
            local.set 4
            br 1 (;@3;)
          end
        end
      else
        local.get 1
        i32.const 7
        i32.and
        local.get 0
        i32.const 7
        i32.and
        i32.eq
        if  ;; label = @3
          loop  ;; label = @4
            local.get 0
            local.get 4
            i32.add
            i32.const 7
            i32.and
            if  ;; label = @5
              local.get 4
              i32.eqz
              br_if 4 (;@1;)
              local.get 4
              i32.const 1
              i32.sub
              local.tee 4
              local.get 0
              i32.add
              local.get 1
              local.get 4
              i32.add
              i32.load8_u
              i32.store8
              br 1 (;@4;)
            end
          end
          loop  ;; label = @4
            local.get 4
            i32.const 8
            i32.ge_u
            if  ;; label = @5
              local.get 4
              i32.const 8
              i32.sub
              local.tee 4
              local.get 0
              i32.add
              local.get 1
              local.get 4
              i32.add
              i64.load
              i64.store
              br 1 (;@4;)
            end
          end
        end
        loop  ;; label = @3
          local.get 4
          if  ;; label = @4
            local.get 4
            i32.const 1
            i32.sub
            local.tee 4
            local.get 0
            i32.add
            local.get 1
            local.get 4
            i32.add
            i32.load8_u
            i32.store8
            br 1 (;@3;)
          end
        end
      end
    end)
  (func $~lib/array/Array<~lib/@graphprotocol/graph-ts/common/collections/TypedMapEntry<~lib/string/String_~lib/string/String>>#push (type 2) (param i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    local.get 0
    i32.load offset=12
    local.tee 6
    i32.const 1
    i32.add
    local.tee 9
    local.get 0
    i32.load offset=8
    local.tee 8
    i32.const 2
    i32.shr_u
    i32.gt_u
    if  ;; label = @1
      local.get 9
      i32.const 268435455
      i32.gt_u
      if  ;; label = @2
        i32.const 1728
        i32.const 1776
        i32.const 19
        i32.const 48
        call $~lib/builtins/abort
        unreachable
      end
      block (result i32)  ;; label = @2
        local.get 0
        i32.load
        local.tee 5
        local.set 2
        local.get 8
        i32.const 1
        i32.shl
        local.tee 3
        i32.const 1073741820
        local.get 3
        i32.const 1073741820
        i32.lt_u
        select
        local.tee 3
        local.get 9
        i32.const 8
        local.get 9
        i32.const 8
        i32.gt_u
        select
        i32.const 2
        i32.shl
        local.tee 4
        local.get 3
        local.get 4
        i32.gt_u
        select
        local.tee 4
        local.tee 7
        i32.const 1073741804
        i32.gt_u
        if  ;; label = @3
          i32.const 1056
          i32.const 1120
          i32.const 99
          i32.const 30
          call $~lib/builtins/abort
          unreachable
        end
        local.get 2
        i32.const 16
        i32.sub
        local.tee 2
        i32.const 15
        i32.and
        i32.const 1
        local.get 2
        select
        if  ;; label = @3
          i32.const 0
          i32.const 1120
          i32.const 45
          i32.const 3
          call $~lib/builtins/abort
          unreachable
        end
        global.get $~lib/rt/stub/offset
        local.get 2
        local.get 2
        i32.const 4
        i32.sub
        local.tee 3
        i32.load
        local.tee 11
        i32.add
        i32.eq
        local.set 12
        local.get 7
        i32.const 16
        i32.add
        local.tee 13
        i32.const 19
        i32.add
        i32.const -16
        i32.and
        i32.const 4
        i32.sub
        local.set 10
        local.get 11
        local.get 13
        i32.lt_u
        if  ;; label = @3
          local.get 12
          if  ;; label = @4
            local.get 13
            i32.const 1073741820
            i32.gt_u
            if  ;; label = @5
              i32.const 1056
              i32.const 1120
              i32.const 52
              i32.const 33
              call $~lib/builtins/abort
              unreachable
            end
            local.get 2
            local.get 10
            i32.add
            local.tee 11
            memory.size
            local.tee 12
            i32.const 16
            i32.shl
            i32.const 15
            i32.add
            i32.const -16
            i32.and
            local.tee 13
            i32.gt_u
            if  ;; label = @5
              local.get 12
              local.get 11
              local.get 13
              i32.sub
              i32.const 65535
              i32.add
              i32.const -65536
              i32.and
              i32.const 16
              i32.shr_u
              local.tee 13
              local.get 12
              local.get 13
              i32.gt_s
              select
              memory.grow
              i32.const 0
              i32.lt_s
              if  ;; label = @6
                local.get 13
                memory.grow
                i32.const 0
                i32.lt_s
                if  ;; label = @7
                  unreachable
                end
              end
            end
            local.get 11
            global.set $~lib/rt/stub/offset
            local.get 3
            local.get 10
            i32.store
          else
            local.get 10
            local.get 11
            i32.const 1
            i32.shl
            local.tee 3
            local.get 3
            local.get 10
            i32.lt_u
            select
            call $~lib/rt/stub/__alloc
            local.tee 3
            local.get 2
            local.get 11
            call $~lib/memory/memory.copy
            local.get 3
            local.set 2
          end
        else
          local.get 12
          if  ;; label = @4
            local.get 2
            local.get 10
            i32.add
            global.set $~lib/rt/stub/offset
            local.get 3
            local.get 10
            i32.store
          end
        end
        local.get 2
        i32.const 4
        i32.sub
        local.get 7
        i32.store offset=16
        local.get 8
        local.get 2
        i32.const 16
        i32.add
        local.tee 2
        i32.add
      end
      local.get 4
      local.get 8
      i32.sub
      call $~lib/memory/memory.fill
      local.get 2
      local.get 5
      i32.ne
      if  ;; label = @2
        local.get 0
        local.get 2
        i32.store
        local.get 0
        local.get 2
        i32.store offset=4
      end
      local.get 0
      local.get 4
      i32.store offset=8
    end
    local.get 0
    i32.load offset=4
    local.get 6
    i32.const 2
    i32.shl
    i32.add
    local.get 1
    i32.store
    local.get 0
    local.get 9
    i32.store offset=12)
  (func $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/string/String>#set (type 3) (param i32 i32 i32)
    (local i32)
    local.get 0
    local.get 1
    call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/string/String>#getEntry
    local.tee 3
    if  ;; label = @1
      local.get 3
      local.get 2
      i32.store offset=4
    else
      i32.const 8
      i32.const 16
      call $~lib/rt/stub/__new
      local.tee 3
      i32.const 0
      i32.store
      local.get 3
      i32.const 0
      i32.store offset=4
      local.get 3
      local.get 1
      i32.store
      local.get 3
      local.get 2
      i32.store offset=4
      local.get 0
      i32.load
      local.get 3
      call $~lib/array/Array<~lib/@graphprotocol/graph-ts/common/collections/TypedMapEntry<~lib/string/String_~lib/string/String>>#push
    end)
  (func $start:tests/resolver.test~anonymous|0~anonymous|0 (type 5)
    call $~lib/matchstick-as/assembly/store/clearStore)
  (func $~lib/rt/__newArray (type 4) (param i32 i32 i32) (result i32)
    (local i32 i32)
    local.get 0
    i32.const 2
    i32.shl
    local.tee 4
    i32.const 0
    call $~lib/rt/stub/__new
    local.set 3
    local.get 2
    if  ;; label = @1
      local.get 3
      local.get 2
      local.get 4
      call $~lib/memory/memory.copy
    end
    i32.const 16
    local.get 1
    call $~lib/rt/stub/__new
    local.tee 1
    local.get 3
    i32.store
    local.get 1
    local.get 3
    i32.store offset=4
    local.get 1
    local.get 4
    i32.store offset=8
    local.get 1
    local.get 0
    i32.store offset=12
    local.get 1)
  (func $~lib/matchstick-as/defaults/newMockEvent (type 6) (result i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $~lib/matchstick-as/defaults/defaultAddress
    local.tee 0
    local.set 7
    global.get $~lib/matchstick-as/defaults/defaultBigInt
    local.tee 1
    local.set 4
    global.get $~lib/matchstick-as/defaults/defaultAddressBytes
    local.set 3
    i32.const 60
    i32.const 21
    call $~lib/rt/stub/__new
    local.tee 2
    local.get 3
    i32.store
    local.get 2
    local.get 3
    i32.store offset=4
    local.get 2
    local.get 3
    i32.store offset=8
    local.get 2
    local.get 0
    i32.store offset=12
    local.get 2
    local.get 3
    i32.store offset=16
    local.get 2
    local.get 3
    i32.store offset=20
    local.get 2
    local.get 3
    i32.store offset=24
    local.get 2
    local.get 1
    i32.store offset=28
    local.get 2
    local.get 1
    i32.store offset=32
    local.get 2
    local.get 1
    i32.store offset=36
    local.get 2
    local.get 1
    i32.store offset=40
    local.get 2
    local.get 1
    i32.store offset=44
    local.get 2
    local.get 1
    i32.store offset=48
    local.get 2
    local.get 1
    i32.store offset=52
    local.get 2
    local.get 1
    i32.store offset=56
    global.get $~lib/matchstick-as/defaults/defaultAddressBytes
    local.set 0
    global.get $~lib/matchstick-as/defaults/defaultBigInt
    local.set 1
    global.get $~lib/matchstick-as/defaults/defaultAddress
    local.set 3
    i32.const 36
    i32.const 22
    call $~lib/rt/stub/__new
    local.tee 15
    local.get 0
    i32.store
    local.get 15
    local.get 1
    i32.store offset=4
    local.get 15
    local.get 3
    i32.store offset=8
    local.get 15
    local.get 3
    i32.store offset=12
    local.get 15
    local.get 1
    i32.store offset=16
    local.get 15
    local.get 1
    i32.store offset=20
    local.get 15
    local.get 1
    i32.store offset=24
    local.get 15
    local.get 0
    i32.store offset=28
    local.get 15
    local.get 1
    i32.store offset=32
    i32.const 0
    i32.const 25
    i32.const 5792
    call $~lib/rt/__newArray
    local.set 8
    global.get $~lib/matchstick-as/defaults/defaultAddressBytes
    local.set 5
    global.get $~lib/matchstick-as/defaults/defaultBigInt
    local.set 3
    global.get $~lib/matchstick-as/defaults/defaultAddress
    local.set 9
    i32.const 1
    i32.const 30
    i32.const 0
    call $~lib/rt/__newArray
    local.tee 6
    i32.load offset=4
    drop
    global.get $~lib/matchstick-as/defaults/defaultAddress
    local.set 10
    i32.const 1
    i32.const 28
    i32.const 0
    call $~lib/rt/__newArray
    local.tee 13
    i32.load offset=4
    global.get $~lib/matchstick-as/defaults/defaultAddressBytes
    local.tee 0
    i32.store
    global.get $~lib/matchstick-as/defaults/defaultIntBytes
    local.set 11
    global.get $~lib/matchstick-as/defaults/defaultBigInt
    local.tee 1
    local.set 12
    i32.const 1
    i32.const 29
    call $~lib/rt/stub/__new
    local.tee 14
    i32.const 0
    i32.store8
    local.get 14
    i32.const 0
    i32.store8
    i32.const 44
    i32.const 27
    call $~lib/rt/stub/__new
    local.tee 16
    local.get 10
    i32.store
    local.get 16
    local.get 13
    i32.store offset=4
    local.get 16
    local.get 0
    i32.store offset=8
    local.get 16
    local.get 0
    i32.store offset=12
    local.get 16
    local.get 11
    i32.store offset=16
    local.get 16
    local.get 0
    i32.store offset=20
    local.get 16
    local.get 1
    i32.store offset=24
    local.get 16
    local.get 12
    i32.store offset=28
    local.get 16
    local.get 1
    i32.store offset=32
    local.get 16
    i32.const 2128
    i32.store offset=36
    local.get 16
    local.get 14
    i32.store offset=40
    local.get 6
    i32.load offset=4
    local.get 16
    i32.store
    global.get $~lib/matchstick-as/defaults/defaultBigInt
    local.set 0
    global.get $~lib/matchstick-as/defaults/defaultAddressBytes
    local.set 1
    i32.const 44
    i32.const 26
    call $~lib/rt/stub/__new
    local.tee 10
    local.get 5
    i32.store
    local.get 10
    local.get 3
    i32.store offset=4
    local.get 10
    local.get 5
    i32.store offset=8
    local.get 10
    local.get 3
    i32.store offset=12
    local.get 10
    local.get 3
    i32.store offset=16
    local.get 10
    local.get 3
    i32.store offset=20
    local.get 10
    local.get 9
    i32.store offset=24
    local.get 10
    local.get 6
    i32.store offset=28
    local.get 10
    local.get 0
    i32.store offset=32
    local.get 10
    local.get 1
    i32.store offset=36
    local.get 10
    local.get 1
    i32.store offset=40
    i32.const 32
    i32.const 20
    call $~lib/rt/stub/__new
    local.tee 0
    local.get 7
    i32.store
    local.get 0
    local.get 4
    i32.store offset=4
    local.get 0
    local.get 4
    i32.store offset=8
    local.get 0
    i32.const 2128
    i32.store offset=12
    local.get 0
    local.get 2
    i32.store offset=16
    local.get 0
    local.get 15
    i32.store offset=20
    local.get 0
    local.get 8
    i32.store offset=24
    local.get 0
    local.get 10
    i32.store offset=28
    local.get 0)
  (func $~lib/array/Array<~lib/@graphprotocol/graph-ts/chain/ethereum/ethereum.EventParam>#constructor (type 6) (result i32)
    (local i32 i32)
    i32.const 16
    i32.const 25
    call $~lib/rt/stub/__new
    local.tee 0
    i32.const 0
    i32.store
    local.get 0
    i32.const 0
    i32.store offset=4
    local.get 0
    i32.const 0
    i32.store offset=8
    local.get 0
    i32.const 0
    i32.store offset=12
    i32.const 32
    i32.const 0
    call $~lib/rt/stub/__new
    local.tee 1
    i32.const 32
    call $~lib/memory/memory.fill
    local.get 0
    local.get 1
    i32.store
    local.get 0
    local.get 1
    i32.store offset=4
    local.get 0
    i32.const 32
    i32.store offset=8
    local.get 0
    i32.const 0
    i32.store offset=12
    local.get 0)
  (func $~lib/string/String#concat (type 1) (param i32 i32) (result i32)
    (local i32 i32 i32)
    local.get 0
    i32.const 20
    i32.sub
    i32.load offset=16
    i32.const 1
    i32.shr_u
    i32.const 1
    i32.shl
    local.tee 2
    local.get 1
    i32.const 20
    i32.sub
    i32.load offset=16
    i32.const 1
    i32.shr_u
    i32.const 1
    i32.shl
    local.tee 3
    i32.add
    local.tee 4
    i32.eqz
    if  ;; label = @1
      i32.const 3296
      return
    end
    local.get 4
    i32.const 1
    call $~lib/rt/stub/__new
    local.tee 4
    local.get 0
    local.get 2
    call $~lib/memory/memory.copy
    local.get 2
    local.get 4
    i32.add
    local.get 1
    local.get 3
    call $~lib/memory/memory.copy
    local.get 4)
  (func $~lib/string/String#charAt (type 1) (param i32 i32) (result i32)
    (local i32)
    local.get 0
    i32.const 20
    i32.sub
    i32.load offset=16
    i32.const 1
    i32.shr_u
    local.get 1
    i32.le_u
    if  ;; label = @1
      i32.const 3296
      return
    end
    i32.const 2
    i32.const 1
    call $~lib/rt/stub/__new
    local.tee 2
    local.get 1
    i32.const 1
    i32.shl
    local.get 0
    i32.add
    i32.load16_u
    i32.store16
    local.get 2)
  (func $~lib/string/String#substr (type 4) (param i32 i32 i32) (result i32)
    (local i32)
    local.get 2
    i32.const 0
    local.get 2
    i32.const 0
    i32.gt_s
    select
    local.tee 2
    local.get 0
    i32.const 20
    i32.sub
    i32.load offset=16
    i32.const 1
    i32.shr_u
    local.tee 3
    block (result i32)  ;; label = @1
      local.get 1
      i32.const 0
      i32.lt_s
      if  ;; label = @2
        local.get 1
        local.get 3
        i32.add
        local.tee 1
        i32.const 0
        local.get 1
        i32.const 0
        i32.gt_s
        select
        local.set 1
      end
      local.get 1
    end
    i32.sub
    local.tee 3
    local.get 2
    local.get 3
    i32.lt_s
    select
    i32.const 1
    i32.shl
    local.tee 2
    i32.const 0
    i32.le_s
    if  ;; label = @1
      i32.const 3296
      return
    end
    local.get 2
    i32.const 1
    call $~lib/rt/stub/__new
    local.tee 3
    local.get 1
    i32.const 1
    i32.shl
    local.get 0
    i32.add
    local.get 2
    call $~lib/memory/memory.copy
    local.get 3)
  (func $~lib/util/string/strtol<i32> (type 0) (param i32) (result i32)
    (local i32 i32 i32 i32)
    local.get 0
    i32.const 20
    i32.sub
    i32.load offset=16
    i32.const 1
    i32.shr_u
    local.tee 2
    i32.eqz
    if  ;; label = @1
      i32.const 0
      return
    end
    local.get 0
    local.tee 1
    i32.load16_u
    local.set 0
    loop  ;; label = @1
      block (result i32)  ;; label = @2
        local.get 0
        i32.const 128
        i32.or
        i32.const 160
        i32.eq
        local.get 0
        i32.const 9
        i32.sub
        i32.const 4
        i32.le_u
        i32.or
        local.get 0
        i32.const 5760
        i32.lt_u
        br_if 0 (;@2;)
        drop
        i32.const 1
        local.get 0
        i32.const -8192
        i32.add
        i32.const 10
        i32.le_u
        br_if 0 (;@2;)
        drop
        block  ;; label = @3
          block  ;; label = @4
            local.get 0
            i32.const 5760
            i32.eq
            br_if 0 (;@4;)
            local.get 0
            i32.const 8232
            i32.eq
            br_if 0 (;@4;)
            local.get 0
            i32.const 8233
            i32.eq
            br_if 0 (;@4;)
            local.get 0
            i32.const 8239
            i32.eq
            br_if 0 (;@4;)
            local.get 0
            i32.const 8287
            i32.eq
            br_if 0 (;@4;)
            local.get 0
            i32.const 12288
            i32.eq
            br_if 0 (;@4;)
            local.get 0
            i32.const 65279
            i32.eq
            br_if 0 (;@4;)
            br 1 (;@3;)
          end
          i32.const 1
          br 1 (;@2;)
        end
        i32.const 0
      end
      if  ;; label = @2
        local.get 1
        i32.const 2
        i32.add
        local.tee 1
        i32.load16_u
        local.set 0
        local.get 2
        i32.const 1
        i32.sub
        local.set 2
        br 1 (;@1;)
      end
    end
    i32.const 1
    local.set 4
    local.get 0
    i32.const 43
    i32.eq
    local.get 0
    i32.const 45
    i32.eq
    i32.or
    if (result i32)  ;; label = @1
      local.get 2
      i32.const 1
      i32.sub
      local.tee 2
      i32.eqz
      if  ;; label = @2
        i32.const 0
        return
      end
      i32.const -1
      i32.const 1
      local.get 0
      i32.const 45
      i32.eq
      select
      local.set 4
      local.get 1
      i32.const 2
      i32.add
      local.tee 1
      i32.load16_u
    else
      local.get 0
    end
    i32.const 48
    i32.eq
    local.get 2
    i32.const 2
    i32.gt_s
    i32.and
    if (result i32)  ;; label = @1
      local.get 1
      i32.load16_u offset=2
      i32.const 32
      i32.or
      i32.const 120
      i32.eq
    else
      i32.const 0
    end
    if  ;; label = @1
      local.get 2
      i32.const 2
      i32.sub
      local.set 2
      local.get 1
      i32.const 4
      i32.add
      local.set 1
    end
    loop  ;; label = @1
      block  ;; label = @2
        local.get 2
        local.tee 0
        i32.const 1
        i32.sub
        local.set 2
        local.get 0
        if  ;; label = @3
          local.get 1
          i32.load16_u
          local.tee 0
          i32.const 48
          i32.sub
          i32.const 10
          i32.lt_u
          if (result i32)  ;; label = @4
            local.get 0
            i32.const 48
            i32.sub
          else
            local.get 0
            i32.const 65
            i32.sub
            i32.const 25
            i32.le_u
            if (result i32)  ;; label = @5
              local.get 0
              i32.const 55
              i32.sub
            else
              local.get 0
              i32.const 87
              i32.sub
              local.get 0
              local.get 0
              i32.const 97
              i32.sub
              i32.const 25
              i32.le_u
              select
            end
          end
          local.tee 0
          i32.const 16
          i32.ge_u
          if  ;; label = @4
            local.get 3
            i32.eqz
            if  ;; label = @5
              i32.const 0
              return
            end
            br 2 (;@2;)
          end
          local.get 0
          local.get 3
          i32.const 4
          i32.shl
          i32.add
          local.set 3
          local.get 1
          i32.const 2
          i32.add
          local.set 1
          br 2 (;@1;)
        end
      end
    end
    local.get 3
    local.get 4
    i32.mul)
  (func $~lib/@graphprotocol/graph-ts/common/collections/ByteArray.fromHexString (type 0) (param i32) (result i32)
    (local i32 i32)
    local.get 0
    i32.const 20
    i32.sub
    i32.load offset=16
    i32.const 1
    i32.shr_u
    i32.const 1
    i32.and
    if  ;; label = @1
      i32.const 5984
      local.get 0
      call $~lib/string/String#concat
      i32.const 6016
      call $~lib/string/String#concat
      i32.const 6080
      i32.const 75
      i32.const 5
      call $~lib/builtins/abort
      unreachable
    end
    local.get 0
    i32.const 20
    i32.sub
    i32.load offset=16
    i32.const 1
    i32.shr_u
    i32.const 2
    i32.ge_u
    if (result i32)  ;; label = @1
      local.get 0
      i32.const 0
      call $~lib/string/String#charAt
      i32.const 6208
      call $~lib/string/String.__eq
    else
      i32.const 0
    end
    if (result i32)  ;; label = @1
      local.get 0
      i32.const 1
      call $~lib/string/String#charAt
      i32.const 6240
      call $~lib/string/String.__eq
    else
      i32.const 0
    end
    if  ;; label = @1
      local.get 0
      i32.const 2
      i32.const 2147483647
      call $~lib/string/String#substr
      local.set 0
    end
    local.get 0
    i32.const 20
    i32.sub
    i32.load offset=16
    i32.const 2
    i32.shr_u
    local.set 2
    i32.const 12
    i32.const 11
    call $~lib/rt/stub/__new
    local.get 2
    call $~lib/@graphprotocol/graph-ts/common/collections/ByteArray#constructor
    local.set 2
    loop  ;; label = @1
      local.get 0
      i32.const 20
      i32.sub
      i32.load offset=16
      i32.const 1
      i32.shr_u
      local.get 1
      i32.gt_s
      if  ;; label = @2
        local.get 2
        local.get 1
        i32.const 2
        i32.div_s
        local.get 0
        local.get 1
        i32.const 2
        call $~lib/string/String#substr
        call $~lib/util/string/strtol<i32>
        i32.extend8_s
        call $~lib/typedarray/Uint8Array#__set
        local.get 1
        i32.const 2
        i32.add
        local.set 1
        br 1 (;@1;)
      end
    end
    local.get 2)
  (func $generated/Resolver1/Resolver/AddrChanged__Params#get:node (type 0) (param i32) (result i32)
    local.get 0
    i32.load
    i32.load offset=24
    i32.const 0
    call $~lib/array/Array<~lib/@graphprotocol/graph-ts/common/collections/TypedMapEntry<~lib/string/String_~lib/string/String>>#__get
    i32.load offset=4
    local.tee 0
    i32.load
    i32.const 1
    i32.eq
    if (result i32)  ;; label = @1
      i32.const 1
    else
      local.get 0
      i32.load
      i32.const 2
      i32.eq
    end
    i32.eqz
    if  ;; label = @1
      i32.const 6960
      i32.const 6704
      i32.const 63
      i32.const 7
      call $~lib/builtins/abort
      unreachable
    end
    local.get 0
    i64.load offset=8
    i32.wrap_i64)
  (func $generated/Resolver1/Resolver/AddrChanged__Params#get:a (type 0) (param i32) (result i32)
    local.get 0
    i32.load
    i32.load offset=24
    i32.const 1
    call $~lib/array/Array<~lib/@graphprotocol/graph-ts/common/collections/TypedMapEntry<~lib/string/String_~lib/string/String>>#__get
    i32.load offset=4
    local.tee 0
    i32.load
    if  ;; label = @1
      i32.const 7040
      i32.const 6704
      i32.const 53
      i32.const 7
      call $~lib/builtins/abort
      unreachable
    end
    local.get 0
    i64.load offset=8
    i32.wrap_i64)
  (func $~lib/@graphprotocol/graph-ts/index/format (type 1) (param i32 i32) (result i32)
    (local i32 i32 i32 i32 i32)
    i32.const 3296
    local.set 5
    local.get 0
    i32.const 20
    i32.sub
    i32.load offset=16
    i32.const 1
    i32.shr_u
    local.set 4
    loop  ;; label = @1
      local.get 4
      local.get 6
      i32.gt_s
      if  ;; label = @2
        local.get 4
        i32.const 1
        i32.sub
        local.get 6
        i32.gt_s
        if (result i32)  ;; label = @3
          local.get 0
          i32.const 20
          i32.sub
          i32.load offset=16
          i32.const 1
          i32.shr_u
          local.get 6
          i32.le_u
          if (result i32)  ;; label = @4
            i32.const -1
          else
            local.get 6
            i32.const 1
            i32.shl
            local.get 0
            i32.add
            i32.load16_u
          end
          i32.const 123
          i32.eq
        else
          i32.const 0
        end
        if (result i32)  ;; label = @3
          local.get 6
          i32.const 1
          i32.add
          local.tee 2
          local.get 0
          i32.const 20
          i32.sub
          i32.load offset=16
          i32.const 1
          i32.shr_u
          i32.ge_u
          if (result i32)  ;; label = @4
            i32.const -1
          else
            local.get 2
            i32.const 1
            i32.shl
            local.get 0
            i32.add
            i32.load16_u
          end
          i32.const 125
          i32.eq
        else
          i32.const 0
        end
        if  ;; label = @3
          local.get 1
          i32.load offset=12
          local.get 3
          i32.le_s
          if (result i32)  ;; label = @4
            i32.const 7136
            local.get 0
            call $~lib/string/String#concat
            i32.const 7232
            i32.const 67
            i32.const 9
            call $~lib/builtins/abort
            unreachable
          else
            local.get 3
            local.tee 2
            i32.const 1
            i32.add
            local.set 3
            local.get 5
            local.get 1
            local.get 2
            call $~lib/array/Array<~lib/@graphprotocol/graph-ts/common/collections/TypedMapEntry<~lib/string/String_~lib/string/String>>#__get
            call $~lib/string/String#concat
            local.set 5
            local.get 6
            i32.const 1
            i32.add
          end
          local.set 6
        else
          local.get 5
          local.get 0
          local.get 6
          call $~lib/string/String#charAt
          call $~lib/string/String#concat
          local.set 5
        end
        local.get 6
        i32.const 1
        i32.add
        local.set 6
        br 1 (;@1;)
      end
    end
    local.get 5)
  (func $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#set (type 3) (param i32 i32 i32)
    (local i32)
    local.get 0
    local.get 1
    call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/string/String>#getEntry
    local.tee 3
    if  ;; label = @1
      local.get 3
      local.get 2
      i32.store offset=4
    else
      i32.const 8
      i32.const 8
      call $~lib/rt/stub/__new
      local.tee 3
      i32.const 0
      i32.store
      local.get 3
      i32.const 0
      i32.store offset=4
      local.get 3
      local.get 1
      i32.store
      local.get 3
      local.get 2
      i32.store offset=4
      local.get 0
      i32.load
      local.get 3
      call $~lib/array/Array<~lib/@graphprotocol/graph-ts/common/collections/TypedMapEntry<~lib/string/String_~lib/string/String>>#push
    end)
  (func $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#get (type 1) (param i32 i32) (result i32)
    (local i32)
    loop  ;; label = @1
      local.get 0
      i32.load
      i32.load offset=12
      local.get 2
      i32.gt_s
      if  ;; label = @2
        local.get 0
        i32.load
        local.get 2
        call $~lib/array/Array<~lib/@graphprotocol/graph-ts/common/collections/TypedMapEntry<~lib/string/String_~lib/string/String>>#__get
        i32.load
        local.get 1
        call $~lib/string/String.__eq
        if  ;; label = @3
          local.get 0
          i32.load
          local.get 2
          call $~lib/array/Array<~lib/@graphprotocol/graph-ts/common/collections/TypedMapEntry<~lib/string/String_~lib/string/String>>#__get
          i32.load offset=4
          return
        end
        local.get 2
        i32.const 1
        i32.add
        local.set 2
        br 1 (;@1;)
      end
    end
    i32.const 0)
  (func $~lib/@graphprotocol/graph-ts/common/value/Value#toString (type 0) (param i32) (result i32)
    local.get 0
    i32.load
    if  ;; label = @1
      i32.const 7936
      i32.const 8000
      i32.const 70
      i32.const 5
      call $~lib/builtins/abort
      unreachable
    end
    local.get 0
    i64.load offset=8
    i32.wrap_i64)
  (func $~lib/util/number/itoa32 (type 0) (param i32) (result i32)
    (local i32 i32 i32 i32)
    local.get 0
    i32.eqz
    if  ;; label = @1
      i32.const 6208
      return
    end
    i32.const 0
    local.get 0
    i32.sub
    local.get 0
    local.get 0
    i32.const 31
    i32.shr_u
    local.tee 3
    select
    local.tee 0
    i32.const 100000
    i32.lt_u
    if (result i32)  ;; label = @1
      local.get 0
      i32.const 100
      i32.lt_u
      if (result i32)  ;; label = @2
        local.get 0
        i32.const 10
        i32.ge_u
        i32.const 1
        i32.add
      else
        local.get 0
        i32.const 10000
        i32.ge_u
        i32.const 3
        i32.add
        local.get 0
        i32.const 1000
        i32.ge_u
        i32.add
      end
    else
      local.get 0
      i32.const 10000000
      i32.lt_u
      if (result i32)  ;; label = @2
        local.get 0
        i32.const 1000000
        i32.ge_u
        i32.const 6
        i32.add
      else
        local.get 0
        i32.const 1000000000
        i32.ge_u
        i32.const 8
        i32.add
        local.get 0
        i32.const 100000000
        i32.ge_u
        i32.add
      end
    end
    local.get 3
    i32.add
    local.tee 1
    i32.const 1
    i32.shl
    i32.const 1
    call $~lib/rt/stub/__new
    local.set 2
    loop  ;; label = @1
      local.get 0
      i32.const 10000
      i32.ge_u
      if  ;; label = @2
        local.get 0
        i32.const 10000
        i32.rem_u
        local.set 4
        local.get 0
        i32.const 10000
        i32.div_u
        local.set 0
        local.get 1
        i32.const 4
        i32.sub
        local.tee 1
        i32.const 1
        i32.shl
        local.get 2
        i32.add
        local.get 4
        i32.const 100
        i32.div_u
        i32.const 2
        i32.shl
        i32.const 8348
        i32.add
        i64.load32_u
        local.get 4
        i32.const 100
        i32.rem_u
        i32.const 2
        i32.shl
        i32.const 8348
        i32.add
        i64.load32_u
        i64.const 32
        i64.shl
        i64.or
        i64.store
        br 1 (;@1;)
      end
    end
    local.get 0
    i32.const 100
    i32.ge_u
    if  ;; label = @1
      local.get 1
      i32.const 2
      i32.sub
      local.tee 1
      i32.const 1
      i32.shl
      local.get 2
      i32.add
      local.get 0
      i32.const 100
      i32.rem_u
      i32.const 2
      i32.shl
      i32.const 8348
      i32.add
      i32.load
      i32.store
      local.get 0
      i32.const 100
      i32.div_u
      local.set 0
    end
    local.get 0
    i32.const 10
    i32.ge_u
    if  ;; label = @1
      local.get 1
      i32.const 2
      i32.sub
      i32.const 1
      i32.shl
      local.get 2
      i32.add
      local.get 0
      i32.const 2
      i32.shl
      i32.const 8348
      i32.add
      i32.load
      i32.store
    else
      local.get 1
      i32.const 1
      i32.sub
      i32.const 1
      i32.shl
      local.get 2
      i32.add
      local.get 0
      i32.const 48
      i32.add
      i32.store16
    end
    local.get 3
    if  ;; label = @1
      local.get 2
      i32.const 45
      i32.store16
    end
    local.get 2)
  (func $~lib/@graphprotocol/graph-ts/common/value/Value#displayData~anonymous|0 (type 4) (param i32 i32 i32) (result i32)
    local.get 0
    call $~lib/@graphprotocol/graph-ts/common/value/Value#displayData)
  (func $~lib/util/string/joinStringArray (type 4) (param i32 i32 i32) (result i32)
    (local i32 i32 i32 i32 i32)
    local.get 1
    i32.const 1
    i32.sub
    local.tee 6
    i32.const 0
    i32.lt_s
    if  ;; label = @1
      i32.const 3296
      return
    end
    local.get 6
    i32.eqz
    if  ;; label = @1
      local.get 0
      i32.load
      local.tee 0
      i32.const 3296
      local.get 0
      select
      return
    end
    loop  ;; label = @1
      local.get 1
      local.get 5
      i32.gt_s
      if  ;; label = @2
        local.get 5
        i32.const 2
        i32.shl
        local.get 0
        i32.add
        i32.load
        local.tee 7
        if  ;; label = @3
          local.get 7
          i32.const 20
          i32.sub
          i32.load offset=16
          i32.const 1
          i32.shr_u
          local.get 3
          i32.add
          local.set 3
        end
        local.get 5
        i32.const 1
        i32.add
        local.set 5
        br 1 (;@1;)
      end
    end
    local.get 6
    local.get 2
    i32.const 20
    i32.sub
    i32.load offset=16
    i32.const 1
    i32.shr_u
    local.tee 1
    i32.mul
    local.get 3
    i32.add
    i32.const 1
    i32.shl
    i32.const 1
    call $~lib/rt/stub/__new
    local.set 3
    i32.const 0
    local.set 5
    loop  ;; label = @1
      local.get 5
      local.get 6
      i32.lt_s
      if  ;; label = @2
        local.get 5
        i32.const 2
        i32.shl
        local.get 0
        i32.add
        i32.load
        local.tee 7
        if  ;; label = @3
          local.get 4
          i32.const 1
          i32.shl
          local.get 3
          i32.add
          local.get 7
          local.get 7
          i32.const 20
          i32.sub
          i32.load offset=16
          i32.const 1
          i32.shr_u
          local.tee 7
          i32.const 1
          i32.shl
          call $~lib/memory/memory.copy
          local.get 4
          local.get 7
          i32.add
          local.set 4
        end
        local.get 1
        if  ;; label = @3
          local.get 4
          i32.const 1
          i32.shl
          local.get 3
          i32.add
          local.get 2
          local.get 1
          i32.const 1
          i32.shl
          call $~lib/memory/memory.copy
          local.get 1
          local.get 4
          i32.add
          local.set 4
        end
        local.get 5
        i32.const 1
        i32.add
        local.set 5
        br 1 (;@1;)
      end
    end
    local.get 6
    i32.const 2
    i32.shl
    local.get 0
    i32.add
    i32.load
    local.tee 0
    if  ;; label = @1
      local.get 4
      i32.const 1
      i32.shl
      local.get 3
      i32.add
      local.get 0
      local.get 0
      i32.const 20
      i32.sub
      i32.load offset=16
      i32.const 1
      i32.shr_u
      i32.const 1
      i32.shl
      call $~lib/memory/memory.copy
    end
    local.get 3)
  (func $~lib/@graphprotocol/graph-ts/common/value/Value#toBigInt (type 0) (param i32) (result i32)
    local.get 0
    i32.load
    i32.const 7
    i32.ne
    if  ;; label = @1
      i32.const 10416
      i32.const 8000
      i32.const 75
      i32.const 5
      call $~lib/builtins/abort
      unreachable
    end
    local.get 0
    i64.load offset=8
    i32.wrap_i64)
  (func $~lib/@graphprotocol/graph-ts/common/value/Value#displayData (type 0) (param i32) (result i32)
    (local i32 i32 i32 i32 i32)
    block  ;; label = @1
      block  ;; label = @2
        block  ;; label = @3
          block  ;; label = @4
            block  ;; label = @5
              block  ;; label = @6
                block  ;; label = @7
                  block  ;; label = @8
                    local.get 0
                    i32.load
                    local.tee 1
                    if  ;; label = @9
                      local.get 1
                      i32.const 1
                      i32.sub
                      br_table 1 (;@8;) 2 (;@7;) 3 (;@6;) 4 (;@5;) 5 (;@4;) 6 (;@3;) 7 (;@2;) 8 (;@1;)
                    end
                    local.get 0
                    call $~lib/@graphprotocol/graph-ts/common/value/Value#toString
                    return
                  end
                  local.get 0
                  i32.load
                  i32.const 5
                  i32.eq
                  if (result i32)  ;; label = @8
                    i32.const 0
                  else
                    local.get 0
                    i32.load
                    i32.const 1
                    i32.ne
                    if  ;; label = @9
                      i32.const 8112
                      i32.const 8000
                      i32.const 65
                      i32.const 5
                      call $~lib/builtins/abort
                      unreachable
                    end
                    local.get 0
                    i64.load offset=8
                    i32.wrap_i64
                  end
                  call $~lib/util/number/itoa32
                  return
                end
                local.get 0
                i32.load
                i32.const 2
                i32.ne
                if  ;; label = @7
                  i32.const 9920
                  i32.const 8000
                  i32.const 80
                  i32.const 5
                  call $~lib/builtins/abort
                  unreachable
                end
                local.get 0
                i64.load offset=8
                i32.wrap_i64
                call $~lib/@graphprotocol/graph-ts/common/numbers/bigDecimal.toString
                return
              end
              i32.const 10080
              i32.const 10112
              local.get 0
              i32.load
              i32.const 5
              i32.eq
              if (result i32)  ;; label = @6
                i32.const 0
              else
                local.get 0
                i32.load
                i32.const 3
                i32.ne
                if  ;; label = @7
                  i32.const 10000
                  i32.const 8000
                  i32.const 52
                  i32.const 5
                  call $~lib/builtins/abort
                  unreachable
                end
                local.get 0
                i64.load offset=8
                i64.const 0
                i64.ne
              end
              select
              return
            end
            local.get 0
            i32.load
            i32.const 4
            i32.ne
            if  ;; label = @5
              i32.const 10144
              i32.const 8000
              i32.const 85
              i32.const 5
              call $~lib/builtins/abort
              unreachable
            end
            local.get 0
            i64.load offset=8
            i32.wrap_i64
            local.tee 3
            i32.load offset=12
            local.tee 4
            i32.const 3
            i32.const 0
            call $~lib/rt/__newArray
            local.tee 1
            i32.load offset=4
            local.set 2
            i32.const 0
            local.set 0
            loop  ;; label = @5
              local.get 4
              local.get 3
              i32.load offset=12
              local.tee 5
              local.get 4
              local.get 5
              i32.lt_s
              select
              local.get 0
              i32.gt_s
              if  ;; label = @6
                local.get 0
                i32.const 2
                i32.shl
                local.tee 5
                local.get 2
                i32.add
                local.get 5
                local.get 3
                i32.load offset=4
                i32.add
                i32.load
                local.get 0
                local.get 3
                i32.const 10240
                i32.load
                call_indirect $0 (type 4)
                i32.store
                local.get 0
                i32.const 1
                i32.add
                local.set 0
                br 1 (;@5;)
              end
            end
            i32.const 10208
            local.get 1
            i32.load offset=4
            local.get 1
            i32.load offset=12
            i32.const 10272
            call $~lib/util/string/joinStringArray
            call $~lib/string/String#concat
            i32.const 10304
            call $~lib/string/String#concat
            return
          end
          i32.const 1360
          return
        end
        local.get 0
        i32.load
        i32.const 6
        i32.ne
        if  ;; label = @3
          i32.const 10336
          i32.const 8000
          i32.const 57
          i32.const 5
          call $~lib/builtins/abort
          unreachable
        end
        local.get 0
        i64.load offset=8
        i32.wrap_i64
        call $~lib/@graphprotocol/graph-ts/common/conversion/typeConversion.bytesToHex
        return
      end
      local.get 0
      call $~lib/@graphprotocol/graph-ts/common/value/Value#toBigInt
      call $~lib/@graphprotocol/graph-ts/common/conversion/typeConversion.bigIntToString
      return
    end
    i32.const 10580
    local.get 0
    i32.load
    call $~lib/util/number/itoa32
    i32.store
    i32.const 10576
    i32.const 10572
    i32.load
    i32.const 2
    i32.shr_u
    i32.const 3296
    call $~lib/util/string/joinStringArray)
  (func $~lib/@graphprotocol/graph-ts/common/value/Value#displayKind (type 0) (param i32) (result i32)
    i32.const 1532
    i32.load
    local.get 0
    i32.load
    i32.le_s
    if (result i32)  ;; label = @1
      i32.const 10660
      local.get 0
      i32.load
      call $~lib/util/number/itoa32
      i32.store
      i32.const 10656
      i32.const 10652
      i32.load
      i32.const 2
      i32.shr_u
      i32.const 3296
      call $~lib/util/string/joinStringArray
    else
      i32.const 1520
      local.get 0
      i32.load
      call $~lib/array/Array<~lib/@graphprotocol/graph-ts/common/collections/TypedMapEntry<~lib/string/String_~lib/string/String>>#__get
    end)
  (func $modules/airstack/domain-name/domain-name/domain.getOrCreateAirAccount (type 1) (param i32 i32) (result i32)
    (local i32 i64)
    i32.const 1568
    local.get 1
    local.get 1
    i32.const 3296
    call $~lib/string/String.__eq
    select
    local.set 2
    i32.const 7360
    local.get 0
    i32.const 7328
    call $~lib/string/String#concat
    local.get 2
    call $~lib/string/String#concat
    call $~lib/@graphprotocol/graph-ts/index/store.get
    local.tee 1
    i32.eqz
    if  ;; label = @1
      local.get 0
      i32.const 7328
      call $~lib/string/String#concat
      local.get 2
      call $~lib/string/String#concat
      local.set 0
      i32.const 4
      i32.const 33
      call $~lib/rt/stub/__new
      call $~lib/@graphprotocol/graph-ts/common/collections/Entity#constructor
      local.tee 1
      i32.const 7408
      block (result i32)  ;; label = @2
        local.get 0
        i64.extend_i32_u
        local.set 3
        i32.const 16
        i32.const 6
        call $~lib/rt/stub/__new
        local.tee 0
        i32.const 0
        i32.store
        local.get 0
        local.get 3
        i64.store offset=8
        local.get 0
      end
      call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#set
      local.get 1
      i32.const 7440
      block (result i32)  ;; label = @2
        local.get 2
        i64.extend_i32_u
        local.set 3
        i32.const 16
        i32.const 6
        call $~lib/rt/stub/__new
        local.tee 0
        i32.const 0
        i32.store
        local.get 0
        local.get 3
        i64.store offset=8
        local.get 0
      end
      call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#set
      local.get 1
      i32.const 7408
      call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#get
      local.tee 0
      i32.eqz
      if  ;; label = @2
        i32.const 7488
        i32.const 7600
        i32.const 219
        i32.const 5
        call $~lib/builtins/abort
        unreachable
      end
      local.get 0
      if  ;; label = @2
        local.get 0
        i32.load
        if  ;; label = @3
          local.get 0
          call $~lib/@graphprotocol/graph-ts/common/value/Value#displayData
          local.set 1
          local.get 0
          call $~lib/@graphprotocol/graph-ts/common/value/Value#displayKind
          local.set 0
          i32.const 7892
          local.get 1
          i32.store
          i32.const 7900
          local.get 0
          i32.store
          i32.const 7888
          i32.const 7884
          i32.load
          i32.const 2
          i32.shr_u
          i32.const 3296
          call $~lib/util/string/joinStringArray
          i32.const 7600
          i32.const 221
          i32.const 7
          call $~lib/builtins/abort
          unreachable
        end
        i32.const 7360
        local.get 0
        call $~lib/@graphprotocol/graph-ts/common/value/Value#toString
        local.get 1
        call $~lib/@graphprotocol/graph-ts/index/store.set
      end
    end
    local.get 1)
  (func $modules/airstack/common/index/getOrCreateAirBlock (type 4) (param i32 i32 i32) (result i32)
    (local i32 i32 i64)
    i32.const 10688
    i32.const 3104
    i32.const 7328
    call $~lib/string/String#concat
    local.get 0
    call $~lib/@graphprotocol/graph-ts/common/conversion/typeConversion.bigIntToString
    call $~lib/string/String#concat
    local.tee 4
    call $~lib/@graphprotocol/graph-ts/index/store.get
    local.tee 3
    i32.eqz
    if  ;; label = @1
      i32.const 4
      i32.const 38
      call $~lib/rt/stub/__new
      call $~lib/@graphprotocol/graph-ts/common/collections/Entity#constructor
      local.tee 3
      i32.const 7408
      block (result i32)  ;; label = @2
        local.get 4
        i64.extend_i32_u
        local.set 5
        i32.const 16
        i32.const 6
        call $~lib/rt/stub/__new
        local.tee 4
        i32.const 0
        i32.store
        local.get 4
        local.get 5
        i64.store offset=8
        local.get 4
      end
      call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#set
      local.get 3
      i32.const 10736
      block (result i32)  ;; label = @2
        local.get 1
        i64.extend_i32_u
        local.set 5
        i32.const 16
        i32.const 6
        call $~lib/rt/stub/__new
        local.tee 1
        i32.const 0
        i32.store
        local.get 1
        local.get 5
        i64.store offset=8
        local.get 1
      end
      call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#set
      local.get 3
      i32.const 10768
      block (result i32)  ;; label = @2
        local.get 0
        i64.extend_i32_u
        local.set 5
        i32.const 16
        i32.const 6
        call $~lib/rt/stub/__new
        local.tee 0
        i32.const 7
        i32.store
        local.get 0
        local.get 5
        i64.store offset=8
        local.get 0
      end
      call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#set
      local.get 3
      i32.const 10800
      block (result i32)  ;; label = @2
        local.get 2
        i64.extend_i32_u
        local.set 5
        i32.const 16
        i32.const 6
        call $~lib/rt/stub/__new
        local.tee 0
        i32.const 7
        i32.store
        local.get 0
        local.get 5
        i64.store offset=8
        local.get 0
      end
      call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#set
      local.get 3
      i32.const 7408
      call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#get
      local.tee 0
      i32.eqz
      if  ;; label = @2
        i32.const 10848
        i32.const 7600
        i32.const 22
        i32.const 5
        call $~lib/builtins/abort
        unreachable
      end
      local.get 0
      if  ;; label = @2
        local.get 0
        i32.load
        if  ;; label = @3
          local.get 0
          call $~lib/@graphprotocol/graph-ts/common/value/Value#displayData
          local.set 1
          local.get 0
          call $~lib/@graphprotocol/graph-ts/common/value/Value#displayKind
          local.set 0
          i32.const 11124
          local.get 1
          i32.store
          i32.const 11132
          local.get 0
          i32.store
          i32.const 11120
          i32.const 11116
          i32.load
          i32.const 2
          i32.shr_u
          i32.const 3296
          call $~lib/util/string/joinStringArray
          i32.const 7600
          i32.const 24
          i32.const 7
          call $~lib/builtins/abort
          unreachable
        end
        i32.const 10688
        local.get 0
        call $~lib/@graphprotocol/graph-ts/common/value/Value#toString
        local.get 3
        call $~lib/@graphprotocol/graph-ts/index/store.set
      end
    end
    local.get 3)
  (func $modules/airstack/domain-name/domain-name/domain.Domain#constructor (type 1) (param i32 i32) (result i32)
    (local i32)
    i32.const 16
    i32.const 39
    call $~lib/rt/stub/__new
    local.tee 2
    local.get 0
    i32.store
    local.get 2
    i32.const 3104
    i32.store offset=4
    local.get 2
    local.get 1
    i32.store offset=8
    local.get 2
    i32.const 5168
    i32.store offset=12
    local.get 2)
  (func $generated/schema/AirAccount#get:id (type 0) (param i32) (result i32)
    local.get 0
    i32.const 7408
    call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#get
    local.tee 0
    i32.eqz
    if  ;; label = @1
      i32.const 11264
      i32.const 7600
      i32.const 235
      i32.const 12
      call $~lib/builtins/abort
      unreachable
    end
    local.get 0
    call $~lib/@graphprotocol/graph-ts/common/value/Value#toString)
  (func $generated/schema/AirDomain#set:isMigrated (type 2) (param i32 i32)
    (local i64)
    local.get 0
    i32.const 11824
    block (result i32)  ;; label = @1
      local.get 1
      i32.eqz
      i32.eqz
      i64.extend_i32_u
      local.set 2
      i32.const 16
      i32.const 6
      call $~lib/rt/stub/__new
      local.tee 0
      i32.const 3
      i32.store
      local.get 0
      local.get 2
      i64.store offset=8
      local.get 0
    end
    call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#set)
  (func $generated/schema/AirBlock#get:id (type 0) (param i32) (result i32)
    local.get 0
    i32.const 7408
    call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#get
    local.tee 0
    i32.eqz
    if  ;; label = @1
      i32.const 11264
      i32.const 7600
      i32.const 38
      i32.const 12
      call $~lib/builtins/abort
      unreachable
    end
    local.get 0
    call $~lib/@graphprotocol/graph-ts/common/value/Value#toString)
  (func $generated/schema/AirDomain#set:lastBlock (type 2) (param i32 i32)
    (local i64)
    local.get 1
    if (result i32)  ;; label = @1
      local.get 1
      i32.const 20
      i32.sub
      i32.load offset=16
      i32.const 1
      i32.shr_u
    else
      i32.const 0
    end
    if  ;; label = @1
      local.get 1
      i32.eqz
      if  ;; label = @2
        i32.const 11264
        i32.const 7600
        i32.const 571
        i32.const 54
        call $~lib/builtins/abort
        unreachable
      end
      local.get 0
      i32.const 12048
      block (result i32)  ;; label = @2
        local.get 1
        i64.extend_i32_u
        local.set 2
        i32.const 16
        i32.const 6
        call $~lib/rt/stub/__new
        local.tee 0
        i32.const 0
        i32.store
        local.get 0
        local.get 2
        i64.store offset=8
        local.get 0
      end
      call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#set
    else
      local.get 0
      i32.const 12048
      block (result i32)  ;; label = @2
        i32.const 16
        i32.const 6
        call $~lib/rt/stub/__new
        local.tee 0
        i32.const 5
        i32.store
        local.get 0
        i64.const 0
        i64.store offset=8
        local.get 0
      end
      call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#set
    end)
  (func $generated/schema/AirDomain#get:id (type 0) (param i32) (result i32)
    local.get 0
    i32.const 7408
    call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#get
    local.tee 0
    i32.eqz
    if  ;; label = @1
      i32.const 11264
      i32.const 7600
      i32.const 317
      i32.const 12
      call $~lib/builtins/abort
      unreachable
    end
    local.get 0
    call $~lib/@graphprotocol/graph-ts/common/value/Value#toString)
  (func $generated/schema/AirDomain#save (type 8) (param i32)
    (local i32)
    local.get 0
    i32.const 7408
    call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#get
    local.tee 1
    i32.eqz
    if  ;; label = @1
      i32.const 12096
      i32.const 7600
      i32.const 301
      i32.const 5
      call $~lib/builtins/abort
      unreachable
    end
    local.get 1
    if  ;; label = @1
      local.get 1
      i32.load
      if  ;; label = @2
        local.get 1
        call $~lib/@graphprotocol/graph-ts/common/value/Value#displayData
        local.set 0
        local.get 1
        call $~lib/@graphprotocol/graph-ts/common/value/Value#displayKind
        local.set 1
        i32.const 12372
        local.get 0
        i32.store
        i32.const 12380
        local.get 1
        i32.store
        i32.const 12368
        i32.const 12364
        i32.load
        i32.const 2
        i32.shr_u
        i32.const 3296
        call $~lib/util/string/joinStringArray
        i32.const 7600
        i32.const 303
        i32.const 7
        call $~lib/builtins/abort
        unreachable
      end
      i32.const 11168
      local.get 1
      call $~lib/@graphprotocol/graph-ts/common/value/Value#toString
      local.get 0
      call $~lib/@graphprotocol/graph-ts/index/store.set
    end)
  (func $modules/airstack/domain-name/domain-name/domain.getOrCreateAirDomain (type 0) (param i32) (result i32)
    (local i32 i32 i32 i32 i64)
    i32.const 11168
    local.get 0
    i32.load
    call $~lib/@graphprotocol/graph-ts/index/store.get
    local.tee 2
    i32.eqz
    if  ;; label = @1
      local.get 0
      i32.load
      local.set 1
      i32.const 4
      i32.const 40
      call $~lib/rt/stub/__new
      call $~lib/@graphprotocol/graph-ts/common/collections/Entity#constructor
      local.tee 2
      i32.const 7408
      block (result i32)  ;; label = @2
        local.get 1
        i64.extend_i32_u
        local.set 5
        i32.const 16
        i32.const 6
        call $~lib/rt/stub/__new
        local.tee 1
        i32.const 0
        i32.store
        local.get 1
        local.get 5
        i64.store offset=8
        local.get 1
      end
      call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#set
      local.get 2
      i32.const 11216
      block (result i32)  ;; label = @2
        global.get $modules/airstack/common/index/BIG_INT_ZERO
        i64.extend_i32_u
        local.set 5
        i32.const 16
        i32.const 6
        call $~lib/rt/stub/__new
        local.tee 1
        i32.const 7
        i32.store
        local.get 1
        local.get 5
        i64.store offset=8
        local.get 1
      end
      call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#set
      local.get 2
      i32.const 11328
      block (result i32)  ;; label = @2
        local.get 0
        i32.load offset=4
        i32.const 1568
        call $modules/airstack/domain-name/domain-name/domain.getOrCreateAirAccount
        call $generated/schema/AirAccount#get:id
        i64.extend_i32_u
        local.set 5
        i32.const 16
        i32.const 6
        call $~lib/rt/stub/__new
        local.tee 1
        i32.const 0
        i32.store
        local.get 1
        local.get 5
        i64.store offset=8
        local.get 1
      end
      call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#set
      block (result i32)  ;; label = @2
        local.get 0
        i32.load offset=12
        local.set 3
        i32.const 11360
        local.get 0
        i32.load offset=4
        local.tee 4
        i32.const 7328
        call $~lib/string/String#concat
        local.get 3
        call $~lib/string/String#concat
        call $~lib/@graphprotocol/graph-ts/index/store.get
        local.tee 1
        i32.eqz
        if  ;; label = @3
          local.get 4
          i32.const 7328
          call $~lib/string/String#concat
          local.get 3
          call $~lib/string/String#concat
          local.set 4
          i32.const 4
          i32.const 41
          call $~lib/rt/stub/__new
          call $~lib/@graphprotocol/graph-ts/common/collections/Entity#constructor
          local.tee 1
          i32.const 7408
          block (result i32)  ;; label = @4
            local.get 4
            i64.extend_i32_u
            local.set 5
            i32.const 16
            i32.const 6
            call $~lib/rt/stub/__new
            local.tee 4
            i32.const 0
            i32.store
            local.get 4
            local.get 5
            i64.store offset=8
            local.get 4
          end
          call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#set
          local.get 1
          i32.const 7440
          block (result i32)  ;; label = @4
            local.get 3
            i64.extend_i32_u
            local.set 5
            i32.const 16
            i32.const 6
            call $~lib/rt/stub/__new
            local.tee 3
            i32.const 0
            i32.store
            local.get 3
            local.get 5
            i64.store offset=8
            local.get 3
          end
          call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#set
          local.get 1
          i32.const 7408
          call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#get
          local.tee 3
          i32.eqz
          if  ;; label = @4
            i32.const 11408
            i32.const 7600
            i32.const 260
            i32.const 5
            call $~lib/builtins/abort
            unreachable
          end
          local.get 3
          if  ;; label = @4
            local.get 3
            i32.load
            if  ;; label = @5
              local.get 3
              call $~lib/@graphprotocol/graph-ts/common/value/Value#displayData
              local.set 0
              local.get 3
              call $~lib/@graphprotocol/graph-ts/common/value/Value#displayKind
              local.set 1
              i32.const 11684
              local.get 0
              i32.store
              i32.const 11692
              local.get 1
              i32.store
              i32.const 11680
              i32.const 11676
              i32.load
              i32.const 2
              i32.shr_u
              i32.const 3296
              call $~lib/util/string/joinStringArray
              i32.const 7600
              i32.const 262
              i32.const 7
              call $~lib/builtins/abort
              unreachable
            end
            i32.const 11360
            local.get 3
            call $~lib/@graphprotocol/graph-ts/common/value/Value#toString
            local.get 1
            call $~lib/@graphprotocol/graph-ts/index/store.set
          end
        end
        local.get 1
      end
      i32.const 7408
      call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#get
      local.tee 1
      i32.eqz
      if  ;; label = @2
        i32.const 11264
        i32.const 7600
        i32.const 276
        i32.const 12
        call $~lib/builtins/abort
        unreachable
      end
      local.get 2
      i32.const 11728
      block (result i32)  ;; label = @2
        local.get 1
        call $~lib/@graphprotocol/graph-ts/common/value/Value#toString
        i64.extend_i32_u
        local.set 5
        i32.const 16
        i32.const 6
        call $~lib/rt/stub/__new
        local.tee 1
        i32.const 0
        i32.store
        local.get 1
        local.get 5
        i64.store offset=8
        local.get 1
      end
      call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#set
      local.get 2
      i32.const 11776
      block (result i32)  ;; label = @2
        i32.const 16
        i32.const 6
        call $~lib/rt/stub/__new
        local.tee 1
        i32.const 3
        i32.store
        local.get 1
        i64.const 0
        i64.store offset=8
        local.get 1
      end
      call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#set
      local.get 2
      i32.const 0
      call $generated/schema/AirDomain#set:isMigrated
      local.get 2
      i32.const 11872
      block (result i32)  ;; label = @2
        global.get $modules/airstack/common/index/BIG_INT_ZERO
        i64.extend_i32_u
        local.set 5
        i32.const 16
        i32.const 6
        call $~lib/rt/stub/__new
        local.tee 1
        i32.const 7
        i32.store
        local.get 1
        local.get 5
        i64.store offset=8
        local.get 1
      end
      call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#set
      local.get 2
      i32.const 11936
      block (result i32)  ;; label = @2
        global.get $modules/airstack/common/index/BIG_INT_ZERO
        i64.extend_i32_u
        local.set 5
        i32.const 16
        i32.const 6
        call $~lib/rt/stub/__new
        local.tee 1
        i32.const 7
        i32.store
        local.get 1
        local.get 5
        i64.store offset=8
        local.get 1
      end
      call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#set
      local.get 2
      i32.const 12000
      block (result i32)  ;; label = @2
        local.get 0
        i32.load offset=8
        call $generated/schema/AirBlock#get:id
        i64.extend_i32_u
        local.set 5
        i32.const 16
        i32.const 6
        call $~lib/rt/stub/__new
        local.tee 1
        i32.const 0
        i32.store
        local.get 1
        local.get 5
        i64.store offset=8
        local.get 1
      end
      call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#set
      local.get 2
      local.get 0
      i32.load offset=8
      call $generated/schema/AirBlock#get:id
      call $generated/schema/AirDomain#set:lastBlock
    end
    local.get 2
    call $generated/schema/AirDomain#get:id
    i32.const 3136
    call $~lib/string/String.__eq
    if  ;; label = @1
      local.get 2
      i32.const 1
      call $generated/schema/AirDomain#set:isMigrated
    end
    local.get 2
    call $generated/schema/AirDomain#save
    local.get 2)
  (func $generated/schema/AirResolver#set:domain (type 2) (param i32 i32)
    (local i64)
    local.get 1
    if (result i32)  ;; label = @1
      local.get 1
      i32.const 20
      i32.sub
      i32.load offset=16
      i32.const 1
      i32.shr_u
    else
      i32.const 0
    end
    if  ;; label = @1
      local.get 1
      i32.eqz
      if  ;; label = @2
        i32.const 11264
        i32.const 7600
        i32.const 1068
        i32.const 51
        call $~lib/builtins/abort
        unreachable
      end
      local.get 0
      i32.const 12528
      block (result i32)  ;; label = @2
        local.get 1
        i64.extend_i32_u
        local.set 2
        i32.const 16
        i32.const 6
        call $~lib/rt/stub/__new
        local.tee 0
        i32.const 0
        i32.store
        local.get 0
        local.get 2
        i64.store offset=8
        local.get 0
      end
      call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#set
    else
      local.get 0
      i32.const 12528
      block (result i32)  ;; label = @2
        i32.const 16
        i32.const 6
        call $~lib/rt/stub/__new
        local.tee 0
        i32.const 5
        i32.store
        local.get 0
        i64.const 0
        i64.store offset=8
        local.get 0
      end
      call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#set
    end)
  (func $generated/schema/AirResolver#set:resolvedAddress (type 2) (param i32 i32)
    (local i64)
    local.get 1
    if (result i32)  ;; label = @1
      local.get 1
      i32.const 20
      i32.sub
      i32.load offset=16
      i32.const 1
      i32.shr_u
    else
      i32.const 0
    end
    if  ;; label = @1
      local.get 1
      i32.eqz
      if  ;; label = @2
        i32.const 11264
        i32.const 7600
        i32.const 1094
        i32.const 60
        call $~lib/builtins/abort
        unreachable
      end
      local.get 0
      i32.const 12416
      block (result i32)  ;; label = @2
        local.get 1
        i64.extend_i32_u
        local.set 2
        i32.const 16
        i32.const 6
        call $~lib/rt/stub/__new
        local.tee 0
        i32.const 0
        i32.store
        local.get 0
        local.get 2
        i64.store offset=8
        local.get 0
      end
      call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#set
    else
      local.get 0
      i32.const 12416
      block (result i32)  ;; label = @2
        i32.const 16
        i32.const 6
        call $~lib/rt/stub/__new
        local.tee 0
        i32.const 5
        i32.store
        local.get 0
        i64.const 0
        i64.store offset=8
        local.get 0
      end
      call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#set
    end)
  (func $generated/schema/AirResolver#save (type 8) (param i32)
    (local i32)
    local.get 0
    i32.const 7408
    call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#get
    local.tee 1
    i32.eqz
    if  ;; label = @1
      i32.const 12560
      i32.const 7600
      i32.const 1032
      i32.const 5
      call $~lib/builtins/abort
      unreachable
    end
    local.get 1
    if  ;; label = @1
      local.get 1
      i32.load
      if  ;; label = @2
        local.get 1
        call $~lib/@graphprotocol/graph-ts/common/value/Value#displayData
        local.set 0
        local.get 1
        call $~lib/@graphprotocol/graph-ts/common/value/Value#displayKind
        local.set 1
        i32.const 12852
        local.get 0
        i32.store
        i32.const 12860
        local.get 1
        i32.store
        i32.const 12848
        i32.const 12844
        i32.load
        i32.const 2
        i32.shr_u
        i32.const 3296
        call $~lib/util/string/joinStringArray
        i32.const 7600
        i32.const 1034
        i32.const 7
        call $~lib/builtins/abort
        unreachable
      end
      i32.const 12480
      local.get 1
      call $~lib/@graphprotocol/graph-ts/common/value/Value#toString
      local.get 0
      call $~lib/@graphprotocol/graph-ts/index/store.set
    end)
  (func $modules/airstack/domain-name/domain-name/domain.getOrCreateAirResolver (type 4) (param i32 i32 i32) (result i32)
    (local i32 i32 i64)
    local.get 0
    call $generated/schema/AirDomain#get:id
    local.set 3
    i32.const 12480
    local.get 1
    i32.const 7328
    call $~lib/string/String#concat
    local.get 3
    call $~lib/string/String#concat
    local.tee 4
    call $~lib/@graphprotocol/graph-ts/index/store.get
    local.tee 3
    i32.eqz
    if  ;; label = @1
      i32.const 4
      i32.const 42
      call $~lib/rt/stub/__new
      call $~lib/@graphprotocol/graph-ts/common/collections/Entity#constructor
      local.tee 3
      i32.const 7408
      block (result i32)  ;; label = @2
        local.get 4
        i64.extend_i32_u
        local.set 5
        i32.const 16
        i32.const 6
        call $~lib/rt/stub/__new
        local.tee 4
        i32.const 0
        i32.store
        local.get 4
        local.get 5
        i64.store offset=8
        local.get 4
      end
      call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#set
      local.get 3
      i32.const 7440
      block (result i32)  ;; label = @2
        i32.const 3104
        local.get 1
        call $modules/airstack/domain-name/domain-name/domain.getOrCreateAirAccount
        call $generated/schema/AirAccount#get:id
        i64.extend_i32_u
        local.set 5
        i32.const 16
        i32.const 6
        call $~lib/rt/stub/__new
        local.tee 1
        i32.const 0
        i32.store
        local.get 1
        local.get 5
        i64.store offset=8
        local.get 1
      end
      call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#set
      local.get 3
      local.get 0
      call $generated/schema/AirDomain#get:id
      call $generated/schema/AirResolver#set:domain
    end
    local.get 2
    if (result i32)  ;; label = @1
      local.get 2
      i32.const 3296
      call $~lib/string/String.__eq
    else
      i32.const 1
    end
    if  ;; label = @1
      local.get 2
      i32.const 0
      call $~lib/string/String.__eq
      if  ;; label = @2
        local.get 3
        i32.const 0
        call $generated/schema/AirResolver#set:resolvedAddress
      end
    else
      local.get 3
      i32.const 3104
      local.get 2
      call $modules/airstack/domain-name/domain-name/domain.getOrCreateAirAccount
      call $generated/schema/AirAccount#get:id
      call $generated/schema/AirResolver#set:resolvedAddress
    end
    local.get 3
    call $generated/schema/AirResolver#save
    local.get 3)
  (func $generated/schema/AirDomain#get:resolver (type 0) (param i32) (result i32)
    local.get 0
    i32.const 12896
    call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#get
    local.tee 0
    if (result i32)  ;; label = @1
      local.get 0
      i32.load
      i32.const 5
      i32.eq
    else
      i32.const 1
    end
    if (result i32)  ;; label = @1
      i32.const 0
    else
      local.get 0
      call $~lib/@graphprotocol/graph-ts/common/value/Value#toString
    end)
  (func $generated/schema/AirResolver#get:id (type 0) (param i32) (result i32)
    local.get 0
    i32.const 7408
    call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#get
    local.tee 0
    i32.eqz
    if  ;; label = @1
      i32.const 11264
      i32.const 7600
      i32.const 1048
      i32.const 12
      call $~lib/builtins/abort
      unreachable
    end
    local.get 0
    call $~lib/@graphprotocol/graph-ts/common/value/Value#toString)
  (func $generated/schema/AirDomain#set:resolvedAddress (type 2) (param i32 i32)
    (local i64)
    local.get 1
    if (result i32)  ;; label = @1
      local.get 1
      i32.const 20
      i32.sub
      i32.load offset=16
      i32.const 1
      i32.shr_u
    else
      i32.const 0
    end
    if  ;; label = @1
      local.get 1
      i32.eqz
      if  ;; label = @2
        i32.const 11264
        i32.const 7600
        i32.const 440
        i32.const 60
        call $~lib/builtins/abort
        unreachable
      end
      local.get 0
      i32.const 12416
      block (result i32)  ;; label = @2
        local.get 1
        i64.extend_i32_u
        local.set 2
        i32.const 16
        i32.const 6
        call $~lib/rt/stub/__new
        local.tee 0
        i32.const 0
        i32.store
        local.get 0
        local.get 2
        i64.store offset=8
        local.get 0
      end
      call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#set
    else
      local.get 0
      i32.const 12416
      block (result i32)  ;; label = @2
        i32.const 16
        i32.const 6
        call $~lib/rt/stub/__new
        local.tee 0
        i32.const 5
        i32.store
        local.get 0
        i64.const 0
        i64.store offset=8
        local.get 0
      end
      call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#set
    end)
  (func $generated/schema/AirEntityCounter#get:count (type 0) (param i32) (result i32)
    local.get 0
    i32.const 13344
    call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#get
    local.tee 0
    i32.eqz
    if  ;; label = @1
      i32.const 11264
      i32.const 7600
      i32.const 185
      i32.const 12
      call $~lib/builtins/abort
      unreachable
    end
    local.get 0
    call $~lib/@graphprotocol/graph-ts/common/value/Value#toBigInt)
  (func $modules/airstack/common/index/updateAirEntityCounter (type 0) (param i32) (result i32)
    (local i32 i32 i32 i64)
    i32.const 13280
    i32.const 2960
    call $~lib/@graphprotocol/graph-ts/index/store.get
    local.tee 1
    if  ;; label = @1
      local.get 1
      call $generated/schema/AirEntityCounter#get:count
      local.set 2
      global.get $modules/airstack/common/index/BIGINT_ONE
      local.set 3
      local.get 2
      i32.eqz
      if  ;; label = @2
        i32.const 14048
        i32.const 14176
        i32.const 184
        i32.const 5
        call $~lib/builtins/abort
        unreachable
      end
      local.get 2
      local.get 3
      call $~lib/@graphprotocol/graph-ts/common/numbers/bigInt.plus
      i64.extend_i32_u
      local.set 4
      i32.const 16
      i32.const 6
      call $~lib/rt/stub/__new
      local.tee 2
      i32.const 7
      i32.store
      local.get 2
      local.get 4
      i64.store offset=8
      local.get 1
      i32.const 13344
      local.get 2
      call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#set
      local.get 0
      call $generated/schema/AirBlock#get:id
      i64.extend_i32_u
      local.set 4
      i32.const 16
      i32.const 6
      call $~lib/rt/stub/__new
      local.tee 0
      i32.const 0
      i32.store
      local.get 0
      local.get 4
      i64.store offset=8
      local.get 1
      i32.const 13376
      local.get 0
      call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#set
    else
      i32.const 4
      i32.const 44
      call $~lib/rt/stub/__new
      call $~lib/@graphprotocol/graph-ts/common/collections/Entity#constructor
      local.set 1
      i32.const 16
      i32.const 6
      call $~lib/rt/stub/__new
      local.tee 2
      i32.const 0
      i32.store
      local.get 2
      i64.const 2960
      i64.store offset=8
      local.get 1
      i32.const 7408
      local.get 2
      call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#set
      global.get $modules/airstack/common/index/BIGINT_ONE
      i64.extend_i32_u
      local.set 4
      i32.const 16
      i32.const 6
      call $~lib/rt/stub/__new
      local.tee 2
      i32.const 7
      i32.store
      local.get 2
      local.get 4
      i64.store offset=8
      local.get 1
      i32.const 13344
      local.get 2
      call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#set
      local.get 0
      call $generated/schema/AirBlock#get:id
      i64.extend_i32_u
      local.set 4
      i32.const 16
      i32.const 6
      call $~lib/rt/stub/__new
      local.tee 2
      i32.const 0
      i32.store
      local.get 2
      local.get 4
      i64.store offset=8
      local.get 1
      i32.const 12000
      local.get 2
      call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#set
      local.get 0
      call $generated/schema/AirBlock#get:id
      i64.extend_i32_u
      local.set 4
      i32.const 16
      i32.const 6
      call $~lib/rt/stub/__new
      local.tee 0
      i32.const 0
      i32.store
      local.get 0
      local.get 4
      i64.store offset=8
      local.get 1
      i32.const 13376
      local.get 0
      call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#set
      i32.const 13424
      i32.const 3056
      call $~lib/@graphprotocol/graph-ts/index/store.get
      i32.eqz
      if  ;; label = @2
        i32.const 4
        i32.const 45
        call $~lib/rt/stub/__new
        call $~lib/@graphprotocol/graph-ts/common/collections/Entity#constructor
        local.set 0
        i32.const 16
        i32.const 6
        call $~lib/rt/stub/__new
        local.tee 2
        i32.const 0
        i32.store
        local.get 2
        i64.const 3056
        i64.store offset=8
        local.get 0
        i32.const 7408
        local.get 2
        call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#set
        call $~lib/@graphprotocol/graph-ts/common/datasource/dataSource.network
        local.set 2
        global.get $modules/airstack/common/index/AIR_NETWORK_MAP
        local.get 2
        call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#get
        local.tee 2
        i32.const 13472
        local.get 2
        select
        i64.extend_i32_u
        local.set 4
        i32.const 16
        i32.const 6
        call $~lib/rt/stub/__new
        local.tee 2
        i32.const 0
        i32.store
        local.get 2
        local.get 4
        i64.store offset=8
        local.get 0
        i32.const 13520
        local.get 2
        call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#set
        i32.const 16
        i32.const 6
        call $~lib/rt/stub/__new
        local.tee 2
        i32.const 0
        i32.store
        local.get 2
        i64.const 3328
        i64.store offset=8
        local.get 0
        i32.const 13568
        local.get 2
        call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#set
        i32.const 16
        i32.const 6
        call $~lib/rt/stub/__new
        local.tee 2
        i32.const 0
        i32.store
        local.get 2
        i64.const 3392
        i64.store offset=8
        local.get 0
        i32.const 13616
        local.get 2
        call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#set
        i32.const 16
        i32.const 6
        call $~lib/rt/stub/__new
        local.tee 2
        i32.const 0
        i32.store
        local.get 2
        i64.const 3424
        i64.store offset=8
        local.get 0
        i32.const 13664
        local.get 2
        call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#set
        i32.const 16
        i32.const 6
        call $~lib/rt/stub/__new
        local.tee 2
        i32.const 0
        i32.store
        local.get 2
        i64.const 3360
        i64.store offset=8
        local.get 0
        i32.const 13696
        local.get 2
        call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#set
        local.get 0
        i32.const 7408
        call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#get
        local.tee 2
        i32.eqz
        if  ;; label = @3
          i32.const 13728
          i32.const 7600
          i32.const 81
          i32.const 5
          call $~lib/builtins/abort
          unreachable
        end
        local.get 2
        if  ;; label = @3
          local.get 2
          i32.load
          if  ;; label = @4
            local.get 2
            call $~lib/@graphprotocol/graph-ts/common/value/Value#displayData
            local.set 0
            local.get 2
            call $~lib/@graphprotocol/graph-ts/common/value/Value#displayKind
            local.set 1
            i32.const 14004
            local.get 0
            i32.store
            i32.const 14012
            local.get 1
            i32.store
            i32.const 14000
            i32.const 13996
            i32.load
            i32.const 2
            i32.shr_u
            i32.const 3296
            call $~lib/util/string/joinStringArray
            i32.const 7600
            i32.const 83
            i32.const 7
            call $~lib/builtins/abort
            unreachable
          end
          i32.const 13424
          local.get 2
          call $~lib/@graphprotocol/graph-ts/common/value/Value#toString
          local.get 0
          call $~lib/@graphprotocol/graph-ts/index/store.set
        end
      end
    end
    local.get 1
    i32.const 7408
    call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#get
    local.tee 0
    i32.eqz
    if  ;; label = @1
      i32.const 14288
      i32.const 7600
      i32.const 158
      i32.const 5
      call $~lib/builtins/abort
      unreachable
    end
    local.get 0
    if  ;; label = @1
      local.get 0
      i32.load
      if  ;; label = @2
        local.get 0
        call $~lib/@graphprotocol/graph-ts/common/value/Value#displayData
        local.set 1
        local.get 0
        call $~lib/@graphprotocol/graph-ts/common/value/Value#displayKind
        local.set 0
        i32.const 14596
        local.get 1
        i32.store
        i32.const 14604
        local.get 0
        i32.store
        i32.const 14592
        i32.const 14588
        i32.load
        i32.const 2
        i32.shr_u
        i32.const 3296
        call $~lib/util/string/joinStringArray
        i32.const 7600
        i32.const 160
        i32.const 7
        call $~lib/builtins/abort
        unreachable
      end
      i32.const 13280
      local.get 0
      call $~lib/@graphprotocol/graph-ts/common/value/Value#toString
      local.get 1
      call $~lib/@graphprotocol/graph-ts/index/store.set
    end
    local.get 1
    call $generated/schema/AirEntityCounter#get:count)
  (func $modules/airstack/domain-name/domain-name/domain.getOrCreateAirAddrChanged (type 9) (param i32 i32 i32 i32 i32 i32 i32)
    (local i64 i32)
    local.get 2
    i32.const 10768
    call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#get
    local.tee 8
    i32.eqz
    if  ;; label = @1
      i32.const 11264
      i32.const 7600
      i32.const 56
      i32.const 12
      call $~lib/builtins/abort
      unreachable
    end
    local.get 8
    call $~lib/@graphprotocol/graph-ts/common/value/Value#toBigInt
    local.set 8
    i32.const 12944
    local.get 3
    i32.const 7328
    call $~lib/string/String#concat
    local.get 8
    call $~lib/@graphprotocol/graph-ts/common/conversion/typeConversion.bigIntToString
    call $~lib/string/String#concat
    i32.const 7328
    call $~lib/string/String#concat
    local.get 0
    call $~lib/@graphprotocol/graph-ts/common/conversion/typeConversion.bigIntToString
    call $~lib/string/String#concat
    local.tee 0
    call $~lib/@graphprotocol/graph-ts/index/store.get
    i32.eqz
    if  ;; label = @1
      i32.const 4
      i32.const 43
      call $~lib/rt/stub/__new
      call $~lib/@graphprotocol/graph-ts/common/collections/Entity#constructor
      local.tee 8
      i32.const 7408
      block (result i32)  ;; label = @2
        local.get 0
        i64.extend_i32_u
        local.set 7
        i32.const 16
        i32.const 6
        call $~lib/rt/stub/__new
        local.tee 0
        i32.const 0
        i32.store
        local.get 0
        local.get 7
        i64.store offset=8
        local.get 0
      end
      call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#set
      local.get 8
      i32.const 12896
      block (result i32)  ;; label = @2
        local.get 1
        call $generated/schema/AirResolver#get:id
        i64.extend_i32_u
        local.set 7
        i32.const 16
        i32.const 6
        call $~lib/rt/stub/__new
        local.tee 0
        i32.const 0
        i32.store
        local.get 0
        local.get 7
        i64.store offset=8
        local.get 0
      end
      call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#set
      local.get 8
      i32.const 12992
      block (result i32)  ;; label = @2
        local.get 2
        call $generated/schema/AirBlock#get:id
        i64.extend_i32_u
        local.set 7
        i32.const 16
        i32.const 6
        call $~lib/rt/stub/__new
        local.tee 0
        i32.const 0
        i32.store
        local.get 0
        local.get 7
        i64.store offset=8
        local.get 0
      end
      call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#set
      local.get 8
      i32.const 13024
      block (result i32)  ;; label = @2
        local.get 3
        i64.extend_i32_u
        local.set 7
        i32.const 16
        i32.const 6
        call $~lib/rt/stub/__new
        local.tee 0
        i32.const 0
        i32.store
        local.get 0
        local.get 7
        i64.store offset=8
        local.get 0
      end
      call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#set
      local.get 4
      if (result i32)  ;; label = @2
        local.get 4
        i32.const 20
        i32.sub
        i32.load offset=16
        i32.const 1
        i32.shr_u
      else
        i32.const 0
      end
      if  ;; label = @2
        local.get 4
        i32.eqz
        if  ;; label = @3
          i32.const 11264
          i32.const 7600
          i32.const 1152
          i32.const 68
          call $~lib/builtins/abort
          unreachable
        end
        local.get 8
        i32.const 13088
        block (result i32)  ;; label = @3
          local.get 4
          i64.extend_i32_u
          local.set 7
          i32.const 16
          i32.const 6
          call $~lib/rt/stub/__new
          local.tee 0
          i32.const 0
          i32.store
          local.get 0
          local.get 7
          i64.store offset=8
          local.get 0
        end
        call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#set
      else
        local.get 8
        i32.const 13088
        block (result i32)  ;; label = @3
          i32.const 16
          i32.const 6
          call $~lib/rt/stub/__new
          local.tee 0
          i32.const 5
          i32.store
          local.get 0
          i64.const 0
          i64.store offset=8
          local.get 0
        end
        call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#set
      end
      local.get 8
      i32.const 13168
      block (result i32)  ;; label = @2
        i32.const 3104
        local.get 5
        call $modules/airstack/domain-name/domain-name/domain.getOrCreateAirAccount
        call $generated/schema/AirAccount#get:id
        i64.extend_i32_u
        local.set 7
        i32.const 16
        i32.const 6
        call $~lib/rt/stub/__new
        local.tee 0
        i32.const 0
        i32.store
        local.get 0
        local.get 7
        i64.store offset=8
        local.get 0
      end
      call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#set
      local.get 8
      i32.const 12528
      block (result i32)  ;; label = @2
        local.get 6
        call $generated/schema/AirDomain#get:id
        i64.extend_i32_u
        local.set 7
        i32.const 16
        i32.const 6
        call $~lib/rt/stub/__new
        local.tee 0
        i32.const 0
        i32.store
        local.get 0
        local.get 7
        i64.store offset=8
        local.get 0
      end
      call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#set
      local.get 6
      i32.const 13232
      call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#get
      local.tee 0
      if (result i32)  ;; label = @2
        local.get 0
        i32.load
        i32.const 5
        i32.eq
      else
        i32.const 1
      end
      if (result i32)  ;; label = @2
        i32.const 0
      else
        local.get 0
        call $~lib/@graphprotocol/graph-ts/common/value/Value#toString
      end
      local.tee 0
      if (result i32)  ;; label = @2
        local.get 0
        i32.const 20
        i32.sub
        i32.load offset=16
        i32.const 1
        i32.shr_u
      else
        i32.const 0
      end
      if  ;; label = @2
        local.get 0
        i32.eqz
        if  ;; label = @3
          i32.const 11264
          i32.const 7600
          i32.const 1196
          i32.const 52
          call $~lib/builtins/abort
          unreachable
        end
        local.get 8
        i32.const 13232
        block (result i32)  ;; label = @3
          local.get 0
          i64.extend_i32_u
          local.set 7
          i32.const 16
          i32.const 6
          call $~lib/rt/stub/__new
          local.tee 0
          i32.const 0
          i32.store
          local.get 0
          local.get 7
          i64.store offset=8
          local.get 0
        end
        call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#set
      else
        local.get 8
        i32.const 13232
        block (result i32)  ;; label = @3
          i32.const 16
          i32.const 6
          call $~lib/rt/stub/__new
          local.tee 0
          i32.const 5
          i32.store
          local.get 0
          i64.const 0
          i64.store offset=8
          local.get 0
        end
        call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#set
      end
      local.get 8
      i32.const 14640
      block (result i32)  ;; label = @2
        local.get 2
        call $modules/airstack/common/index/updateAirEntityCounter
        i64.extend_i32_u
        local.set 7
        i32.const 16
        i32.const 6
        call $~lib/rt/stub/__new
        local.tee 0
        i32.const 7
        i32.store
        local.get 0
        local.get 7
        i64.store offset=8
        local.get 0
      end
      call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#set
      local.get 8
      i32.const 7408
      call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#get
      local.tee 0
      i32.eqz
      if  ;; label = @2
        i32.const 14672
        i32.const 7600
        i32.const 1107
        i32.const 5
        call $~lib/builtins/abort
        unreachable
      end
      local.get 0
      if  ;; label = @2
        local.get 0
        i32.load
        if  ;; label = @3
          local.get 0
          call $~lib/@graphprotocol/graph-ts/common/value/Value#displayData
          local.set 1
          local.get 0
          call $~lib/@graphprotocol/graph-ts/common/value/Value#displayKind
          local.set 0
          i32.const 14980
          local.get 1
          i32.store
          i32.const 14988
          local.get 0
          i32.store
          i32.const 14976
          i32.const 14972
          i32.load
          i32.const 2
          i32.shr_u
          i32.const 3296
          call $~lib/util/string/joinStringArray
          i32.const 7600
          i32.const 1109
          i32.const 7
          call $~lib/builtins/abort
          unreachable
        end
        i32.const 12944
        local.get 0
        call $~lib/@graphprotocol/graph-ts/common/value/Value#toString
        local.get 8
        call $~lib/@graphprotocol/graph-ts/index/store.set
      end
    end)
  (func $~lib/matchstick-as/assembly/assert/assert.fieldEquals (type 7) (param i32 i32 i32 i32)
    local.get 0
    local.get 1
    local.get 2
    local.get 3
    call $~lib/matchstick-as/assembly/assert/_assert.fieldEquals
    i32.eqz
    if  ;; label = @1
      i32.const 15024
      i32.const 15088
      i32.const 13
      i32.const 7
      call $~lib/builtins/abort
      unreachable
    end)
  (func $start:tests/resolver.test~anonymous|0~anonymous|1 (type 5)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i64)
    call $~lib/matchstick-as/defaults/newMockEvent
    local.tee 0
    call $~lib/array/Array<~lib/@graphprotocol/graph-ts/chain/ethereum/ethereum.EventParam>#constructor
    i32.store offset=24
    local.get 0
    i32.load offset=16
    i32.const 10098239
    call $~lib/@graphprotocol/graph-ts/common/collections/ByteArray.fromI32
    i32.store offset=28
    local.get 0
    i32.load offset=16
    i32.const 2879823
    call $~lib/@graphprotocol/graph-ts/common/collections/ByteArray.fromI32
    i32.store offset=40
    local.get 0
    i32.load offset=16
    i32.const 5824
    call $~lib/@graphprotocol/graph-ts/common/collections/ByteArray.fromHexString
    i32.store
    local.get 0
    i32.load offset=20
    i32.const 6272
    call $~lib/@graphprotocol/graph-ts/common/collections/ByteArray.fromHexString
    i32.store
    local.get 0
    i32.const 6432
    call $~lib/@graphprotocol/graph-ts/common/conversion/typeConversion.stringToH160
    i32.store
    local.get 0
    i32.const 76
    call $~lib/@graphprotocol/graph-ts/common/collections/ByteArray.fromI32
    i32.store offset=4
    local.get 0
    i32.load offset=24
    local.set 1
    i32.const 5520
    call $~lib/@graphprotocol/graph-ts/common/collections/ByteArray.fromHexString
    i64.extend_i32_u
    local.set 10
    i32.const 16
    i32.const 24
    call $~lib/rt/stub/__new
    local.tee 2
    i32.const 1
    i32.store
    local.get 2
    local.get 10
    i64.store offset=8
    i32.const 8
    i32.const 23
    call $~lib/rt/stub/__new
    local.tee 3
    i32.const 6544
    i32.store
    local.get 3
    local.get 2
    i32.store offset=4
    local.get 1
    local.get 3
    call $~lib/array/Array<~lib/@graphprotocol/graph-ts/common/collections/TypedMapEntry<~lib/string/String_~lib/string/String>>#push
    local.get 0
    i32.load offset=24
    local.set 1
    i32.const 5680
    call $~lib/@graphprotocol/graph-ts/common/conversion/typeConversion.stringToH160
    local.tee 2
    i32.load offset=8
    i32.const 20
    i32.ne
    if  ;; label = @1
      i32.const 6608
      i32.const 6704
      i32.const 290
      i32.const 7
      call $~lib/builtins/abort
      unreachable
    end
    local.get 2
    i64.extend_i32_u
    local.set 10
    i32.const 16
    i32.const 24
    call $~lib/rt/stub/__new
    local.tee 2
    i32.const 0
    i32.store
    local.get 2
    local.get 10
    i64.store offset=8
    i32.const 8
    i32.const 23
    call $~lib/rt/stub/__new
    local.tee 3
    i32.const 6576
    i32.store
    local.get 3
    local.get 2
    i32.store offset=4
    local.get 1
    local.get 3
    call $~lib/array/Array<~lib/@graphprotocol/graph-ts/common/collections/TypedMapEntry<~lib/string/String_~lib/string/String>>#push
    i32.const 4
    i32.const 3
    i32.const 0
    call $~lib/rt/__newArray
    local.tee 1
    i32.load offset=4
    drop
    i32.const 4
    i32.const 32
    call $~lib/rt/stub/__new
    local.tee 2
    i32.const 0
    i32.store
    local.get 2
    local.get 0
    i32.store
    local.get 2
    call $generated/Resolver1/Resolver/AddrChanged__Params#get:node
    call $~lib/@graphprotocol/graph-ts/common/conversion/typeConversion.bytesToHex
    local.set 2
    local.get 1
    i32.load offset=4
    local.get 2
    i32.store
    i32.const 4
    i32.const 32
    call $~lib/rt/stub/__new
    local.tee 2
    i32.const 0
    i32.store
    local.get 2
    local.get 0
    i32.store
    local.get 2
    call $generated/Resolver1/Resolver/AddrChanged__Params#get:a
    call $~lib/@graphprotocol/graph-ts/common/conversion/typeConversion.bytesToHex
    local.set 2
    local.get 1
    i32.load offset=4
    local.get 2
    i32.store offset=4
    local.get 0
    i32.load
    call $~lib/@graphprotocol/graph-ts/common/conversion/typeConversion.bytesToHex
    local.set 2
    local.get 1
    i32.load offset=4
    local.get 2
    i32.store offset=8
    local.get 0
    i32.load offset=20
    i32.load
    call $~lib/@graphprotocol/graph-ts/common/conversion/typeConversion.bytesToHex
    local.set 2
    local.get 1
    i32.load offset=4
    local.get 2
    i32.store offset=12
    i32.const 3
    i32.const 6816
    local.get 1
    call $~lib/@graphprotocol/graph-ts/index/format
    call $~lib/@graphprotocol/graph-ts/index/log.log
    local.get 0
    i32.load offset=4
    local.set 3
    local.get 0
    i32.load
    call $~lib/@graphprotocol/graph-ts/common/conversion/typeConversion.bytesToHex
    local.set 4
    i32.const 4
    i32.const 32
    call $~lib/rt/stub/__new
    local.tee 1
    i32.const 0
    i32.store
    local.get 1
    local.get 0
    i32.store
    local.get 1
    call $generated/Resolver1/Resolver/AddrChanged__Params#get:a
    call $~lib/@graphprotocol/graph-ts/common/conversion/typeConversion.bytesToHex
    local.set 1
    i32.const 4
    i32.const 32
    call $~lib/rt/stub/__new
    local.tee 2
    i32.const 0
    i32.store
    local.get 2
    local.get 0
    i32.store
    local.get 2
    call $generated/Resolver1/Resolver/AddrChanged__Params#get:node
    call $~lib/@graphprotocol/graph-ts/common/conversion/typeConversion.bytesToHex
    local.set 5
    local.get 0
    i32.load offset=16
    local.tee 2
    i32.load offset=28
    local.set 6
    local.get 2
    i32.load
    call $~lib/@graphprotocol/graph-ts/common/conversion/typeConversion.bytesToHex
    local.set 7
    local.get 0
    i32.load offset=16
    i32.load offset=40
    local.set 2
    local.get 0
    i32.load offset=20
    i32.load
    call $~lib/@graphprotocol/graph-ts/common/conversion/typeConversion.bytesToHex
    local.set 8
    i32.const 3104
    local.get 1
    call $modules/airstack/domain-name/domain-name/domain.getOrCreateAirAccount
    local.set 9
    local.get 5
    local.get 6
    local.get 7
    local.get 2
    call $modules/airstack/common/index/getOrCreateAirBlock
    local.tee 2
    call $modules/airstack/domain-name/domain-name/domain.Domain#constructor
    call $modules/airstack/domain-name/domain-name/domain.getOrCreateAirDomain
    local.tee 5
    i32.const 12416
    call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/@graphprotocol/graph-ts/common/value/Value>#get
    local.tee 6
    if (result i32)  ;; label = @1
      local.get 6
      i32.load
      i32.const 5
      i32.eq
    else
      i32.const 1
    end
    if (result i32)  ;; label = @1
      i32.const 0
    else
      local.get 6
      call $~lib/@graphprotocol/graph-ts/common/value/Value#toString
    end
    local.set 6
    local.get 5
    local.get 4
    local.get 1
    call $modules/airstack/domain-name/domain-name/domain.getOrCreateAirResolver
    local.tee 4
    local.get 5
    call $generated/schema/AirDomain#get:id
    call $generated/schema/AirResolver#set:domain
    local.get 4
    call $generated/schema/AirResolver#save
    local.get 5
    call $generated/schema/AirDomain#get:resolver
    local.get 4
    call $generated/schema/AirResolver#get:id
    call $~lib/string/String.__eq
    if  ;; label = @1
      local.get 5
      local.get 9
      call $generated/schema/AirAccount#get:id
      call $generated/schema/AirDomain#set:resolvedAddress
      local.get 5
      local.get 2
      call $generated/schema/AirBlock#get:id
      call $generated/schema/AirDomain#set:lastBlock
      local.get 5
      call $generated/schema/AirDomain#save
    end
    local.get 3
    local.get 4
    local.get 2
    local.get 8
    local.get 6
    local.get 1
    local.get 5
    call $modules/airstack/domain-name/domain-name/domain.getOrCreateAirAddrChanged
    local.get 0
    i32.load offset=20
    i32.load
    call $~lib/@graphprotocol/graph-ts/common/conversion/typeConversion.bytesToHex
    i32.const 7328
    call $~lib/string/String#concat
    local.get 0
    i32.load offset=16
    i32.load offset=28
    call $~lib/@graphprotocol/graph-ts/common/conversion/typeConversion.bigIntToString
    call $~lib/string/String#concat
    i32.const 7328
    call $~lib/string/String#concat
    local.get 0
    i32.load offset=4
    call $~lib/@graphprotocol/graph-ts/common/conversion/typeConversion.bigIntToString
    call $~lib/string/String#concat
    local.set 1
    local.get 0
    i32.load
    call $~lib/@graphprotocol/graph-ts/common/conversion/typeConversion.bytesToHex
    i32.const 7328
    call $~lib/string/String#concat
    local.set 2
    i32.const 4
    i32.const 32
    call $~lib/rt/stub/__new
    local.tee 3
    i32.const 0
    i32.store
    local.get 3
    local.get 0
    i32.store
    local.get 2
    local.get 3
    call $generated/Resolver1/Resolver/AddrChanged__Params#get:node
    call $~lib/@graphprotocol/graph-ts/common/conversion/typeConversion.bytesToHex
    call $~lib/string/String#concat
    local.set 2
    i32.const 4
    i32.const 32
    call $~lib/rt/stub/__new
    local.tee 3
    i32.const 0
    i32.store
    local.get 3
    local.get 0
    i32.store
    local.get 3
    call $generated/Resolver1/Resolver/AddrChanged__Params#get:node
    call $~lib/@graphprotocol/graph-ts/common/conversion/typeConversion.bytesToHex
    local.set 3
    i32.const 3104
    i32.const 7328
    call $~lib/string/String#concat
    local.get 0
    i32.load offset=16
    i32.load offset=28
    call $~lib/@graphprotocol/graph-ts/common/conversion/typeConversion.bigIntToString
    call $~lib/string/String#concat
    local.set 4
    i32.const 12480
    local.get 2
    i32.const 12528
    local.get 3
    call $~lib/matchstick-as/assembly/assert/assert.fieldEquals
    i32.const 11168
    local.get 3
    i32.const 12048
    local.get 4
    call $~lib/matchstick-as/assembly/assert/assert.fieldEquals
    i32.const 12944
    local.get 1
    i32.const 12896
    local.get 2
    call $~lib/matchstick-as/assembly/assert/assert.fieldEquals
    i32.const 12944
    local.get 1
    i32.const 12992
    local.get 4
    call $~lib/matchstick-as/assembly/assert/assert.fieldEquals
    i32.const 12944
    local.get 1
    i32.const 13024
    local.get 0
    i32.load offset=20
    i32.load
    call $~lib/@graphprotocol/graph-ts/common/conversion/typeConversion.bytesToHex
    call $~lib/matchstick-as/assembly/assert/assert.fieldEquals
    i32.const 12944
    local.get 1
    i32.const 13088
    i32.const 1360
    call $~lib/matchstick-as/assembly/assert/assert.fieldEquals
    i32.const 3104
    i32.const 7328
    call $~lib/string/String#concat
    local.set 2
    i32.const 4
    i32.const 32
    call $~lib/rt/stub/__new
    local.tee 4
    i32.const 0
    i32.store
    local.get 4
    local.get 0
    i32.store
    i32.const 12944
    local.get 1
    i32.const 13168
    local.get 2
    local.get 4
    call $generated/Resolver1/Resolver/AddrChanged__Params#get:a
    call $~lib/@graphprotocol/graph-ts/common/conversion/typeConversion.bytesToHex
    call $~lib/string/String#concat
    call $~lib/matchstick-as/assembly/assert/assert.fieldEquals
    i32.const 12944
    local.get 1
    i32.const 12528
    local.get 3
    call $~lib/matchstick-as/assembly/assert/assert.fieldEquals
    i32.const 12944
    local.get 1
    i32.const 13232
    i32.const 1360
    call $~lib/matchstick-as/assembly/assert/assert.fieldEquals
    i32.const 12944
    local.get 1
    i32.const 14640
    i32.const 3104
    call $~lib/matchstick-as/assembly/assert/assert.fieldEquals)
  (func $start:tests/resolver.test~anonymous|0~anonymous|2 (type 5)
    (local i32 i32 i32 i32 i32 i32 i64)
    call $~lib/matchstick-as/defaults/newMockEvent
    local.tee 0
    call $~lib/array/Array<~lib/@graphprotocol/graph-ts/chain/ethereum/ethereum.EventParam>#constructor
    i32.store offset=24
    local.get 0
    i32.load offset=16
    i32.const 10098239
    call $~lib/@graphprotocol/graph-ts/common/collections/ByteArray.fromI32
    i32.store offset=28
    local.get 0
    i32.load offset=16
    i32.const 2879823
    call $~lib/@graphprotocol/graph-ts/common/collections/ByteArray.fromI32
    i32.store offset=40
    local.get 0
    i32.load offset=16
    i32.const 5824
    call $~lib/@graphprotocol/graph-ts/common/collections/ByteArray.fromHexString
    i32.store
    local.get 0
    i32.load offset=20
    i32.const 6272
    call $~lib/@graphprotocol/graph-ts/common/collections/ByteArray.fromHexString
    i32.store
    local.get 0
    i32.const 6432
    call $~lib/@graphprotocol/graph-ts/common/conversion/typeConversion.stringToH160
    i32.store
    local.get 0
    i32.load offset=24
    local.set 1
    i32.const 5520
    call $~lib/@graphprotocol/graph-ts/common/collections/ByteArray.fromHexString
    i64.extend_i32_u
    local.set 6
    i32.const 16
    i32.const 24
    call $~lib/rt/stub/__new
    local.tee 2
    i32.const 1
    i32.store
    local.get 2
    local.get 6
    i64.store offset=8
    i32.const 8
    i32.const 23
    call $~lib/rt/stub/__new
    local.tee 3
    i32.const 6544
    i32.store
    local.get 3
    local.get 2
    i32.store offset=4
    local.get 1
    local.get 3
    call $~lib/array/Array<~lib/@graphprotocol/graph-ts/common/collections/TypedMapEntry<~lib/string/String_~lib/string/String>>#push
    i32.const 3
    i32.const 3
    i32.const 0
    call $~lib/rt/__newArray
    local.tee 1
    i32.load offset=4
    drop
    i32.const 4
    i32.const 47
    call $~lib/rt/stub/__new
    local.tee 2
    i32.const 0
    i32.store
    local.get 2
    local.get 0
    i32.store
    local.get 2
    call $generated/Resolver1/Resolver/AddrChanged__Params#get:node
    call $~lib/@graphprotocol/graph-ts/common/conversion/typeConversion.bytesToHex
    local.set 2
    local.get 1
    i32.load offset=4
    local.get 2
    i32.store
    local.get 0
    i32.load
    call $~lib/@graphprotocol/graph-ts/common/conversion/typeConversion.bytesToHex
    local.set 2
    local.get 1
    i32.load offset=4
    local.get 2
    i32.store offset=4
    local.get 0
    i32.load offset=20
    i32.load
    call $~lib/@graphprotocol/graph-ts/common/conversion/typeConversion.bytesToHex
    local.set 2
    local.get 1
    i32.load offset=4
    local.get 2
    i32.store offset=8
    i32.const 3
    i32.const 15296
    local.get 1
    call $~lib/@graphprotocol/graph-ts/index/format
    call $~lib/@graphprotocol/graph-ts/index/log.log
    local.get 0
    i32.load offset=16
    local.tee 1
    i32.load offset=28
    local.set 2
    local.get 1
    i32.load
    call $~lib/@graphprotocol/graph-ts/common/conversion/typeConversion.bytesToHex
    local.set 3
    local.get 0
    i32.load offset=16
    i32.load offset=40
    local.set 4
    i32.const 4
    i32.const 47
    call $~lib/rt/stub/__new
    local.tee 1
    i32.const 0
    i32.store
    local.get 1
    local.get 0
    i32.store
    local.get 1
    call $generated/Resolver1/Resolver/AddrChanged__Params#get:node
    call $~lib/@graphprotocol/graph-ts/common/conversion/typeConversion.bytesToHex
    local.set 5
    local.get 0
    i32.load
    call $~lib/@graphprotocol/graph-ts/common/conversion/typeConversion.bytesToHex
    local.set 1
    local.get 5
    local.get 2
    local.get 3
    local.get 4
    call $modules/airstack/common/index/getOrCreateAirBlock
    local.tee 2
    call $modules/airstack/domain-name/domain-name/domain.Domain#constructor
    call $modules/airstack/domain-name/domain-name/domain.getOrCreateAirDomain
    local.tee 3
    local.get 1
    i32.const 0
    call $modules/airstack/domain-name/domain-name/domain.getOrCreateAirResolver
    local.set 1
    local.get 3
    if (result i32)  ;; label = @1
      local.get 3
      call $generated/schema/AirDomain#get:resolver
      local.get 1
      call $generated/schema/AirResolver#get:id
      i32.eq
    else
      i32.const 0
    end
    if  ;; label = @1
      local.get 3
      i32.const 0
      call $generated/schema/AirDomain#set:resolvedAddress
      local.get 3
      local.get 2
      call $generated/schema/AirBlock#get:id
      call $generated/schema/AirDomain#set:lastBlock
      local.get 3
      call $generated/schema/AirDomain#save
    end
    i32.const 10688
    i32.const 3104
    i32.const 7328
    call $~lib/string/String#concat
    local.get 0
    i32.load offset=16
    i32.load offset=28
    call $~lib/@graphprotocol/graph-ts/common/conversion/typeConversion.bigIntToString
    call $~lib/string/String#concat
    local.tee 1
    i32.const 10768
    local.get 0
    i32.load offset=16
    i32.load offset=28
    call $~lib/@graphprotocol/graph-ts/common/conversion/typeConversion.bigIntToString
    call $~lib/matchstick-as/assembly/assert/assert.fieldEquals
    i32.const 10688
    local.get 1
    i32.const 10736
    local.get 0
    i32.load offset=16
    i32.load
    call $~lib/@graphprotocol/graph-ts/common/conversion/typeConversion.bytesToHex
    call $~lib/matchstick-as/assembly/assert/assert.fieldEquals
    i32.const 10688
    local.get 1
    i32.const 10800
    local.get 0
    i32.load offset=16
    i32.load offset=40
    call $~lib/@graphprotocol/graph-ts/common/conversion/typeConversion.bigIntToString
    call $~lib/matchstick-as/assembly/assert/assert.fieldEquals
    i32.const 4
    i32.const 47
    call $~lib/rt/stub/__new
    local.tee 2
    i32.const 0
    i32.store
    local.get 2
    local.get 0
    i32.store
    i32.const 11168
    local.get 2
    call $generated/Resolver1/Resolver/AddrChanged__Params#get:node
    call $~lib/@graphprotocol/graph-ts/common/conversion/typeConversion.bytesToHex
    local.tee 2
    i32.const 12048
    local.get 1
    call $~lib/matchstick-as/assembly/assert/assert.fieldEquals
    local.get 0
    i32.load
    call $~lib/@graphprotocol/graph-ts/common/conversion/typeConversion.bytesToHex
    i32.const 7328
    call $~lib/string/String#concat
    local.set 1
    i32.const 4
    i32.const 47
    call $~lib/rt/stub/__new
    local.tee 3
    i32.const 0
    i32.store
    local.get 3
    local.get 0
    i32.store
    i32.const 12480
    local.get 1
    local.get 3
    call $generated/Resolver1/Resolver/AddrChanged__Params#get:node
    call $~lib/@graphprotocol/graph-ts/common/conversion/typeConversion.bytesToHex
    call $~lib/string/String#concat
    local.tee 1
    i32.const 12528
    local.get 2
    call $~lib/matchstick-as/assembly/assert/assert.fieldEquals
    i32.const 12480
    local.get 1
    i32.const 7440
    i32.const 3104
    i32.const 7328
    call $~lib/string/String#concat
    local.get 0
    i32.load
    call $~lib/@graphprotocol/graph-ts/common/conversion/typeConversion.bytesToHex
    call $~lib/string/String#concat
    call $~lib/matchstick-as/assembly/assert/assert.fieldEquals)
  (func $start:tests/resolver.test~anonymous|0 (type 5)
    i32.const 5376
    i32.load
    i32.const 5408
    call $~lib/matchstick-as/assembly/index/_registerHook
    i32.const 5456
    i32.const 0
    i32.const 15184
    i32.load
    call $~lib/matchstick-as/assembly/index/_registerTest
    i32.const 15216
    i32.const 0
    i32.const 15424
    i32.load
    call $~lib/matchstick-as/assembly/index/_registerTest)
  (func $node_modules/@graphprotocol/graph-ts/global/global/id_of_type (type 0) (param i32) (result i32)
    block  ;; label = @1
      block  ;; label = @2
        block  ;; label = @3
          block  ;; label = @4
            block  ;; label = @5
              block  ;; label = @6
                block  ;; label = @7
                  block  ;; label = @8
                    block  ;; label = @9
                      block  ;; label = @10
                        block  ;; label = @11
                          block  ;; label = @12
                            block  ;; label = @13
                              block  ;; label = @14
                                block  ;; label = @15
                                  block  ;; label = @16
                                    block  ;; label = @17
                                      block  ;; label = @18
                                        block  ;; label = @19
                                          block  ;; label = @20
                                            block  ;; label = @21
                                              block  ;; label = @22
                                                block  ;; label = @23
                                                  block  ;; label = @24
                                                    block  ;; label = @25
                                                      block  ;; label = @26
                                                        block  ;; label = @27
                                                          block  ;; label = @28
                                                            block  ;; label = @29
                                                              block  ;; label = @30
                                                                block  ;; label = @31
                                                                  block  ;; label = @32
                                                                    block  ;; label = @33
                                                                      block  ;; label = @34
                                                                        block  ;; label = @35
                                                                          block  ;; label = @36
                                                                            block  ;; label = @37
                                                                              block  ;; label = @38
                                                                                block  ;; label = @39
                                                                                  block  ;; label = @40
                                                                                    block  ;; label = @41
                                                                                      block  ;; label = @42
                                                                                        block  ;; label = @43
                                                                                          block  ;; label = @44
                                                                                            block  ;; label = @45
                                                                                              block  ;; label = @46
                                                                                                block  ;; label = @47
                                                                                                  block  ;; label = @48
                                                                                                    block  ;; label = @49
                                                                                                      block  ;; label = @50
                                                                                                        block  ;; label = @51
                                                                                                          block  ;; label = @52
                                                                                                            block  ;; label = @53
                                                                                                              block  ;; label = @54
                                                                                                                block  ;; label = @55
                                                                                                                  block  ;; label = @56
                                                                                                                    block  ;; label = @57
                                                                                                                      block  ;; label = @58
                                                                                                                        block  ;; label = @59
                                                                                                                          block  ;; label = @60
                                                                                                                            block  ;; label = @61
                                                                                                                              block  ;; label = @62
                                                                                                                                block  ;; label = @63
                                                                                                                                  block  ;; label = @64
                                                                                                                                    block  ;; label = @65
                                                                                                                                      block  ;; label = @66
                                                                                                                                        block  ;; label = @67
                                                                                                                                          block  ;; label = @68
                                                                                                                                            block  ;; label = @69
                                                                                                                                              block  ;; label = @70
                                                                                                                                                block  ;; label = @71
                                                                                                                                                  block  ;; label = @72
                                                                                                                                                    block  ;; label = @73
                                                                                                                                                      block  ;; label = @74
                                                                                                                                                        block  ;; label = @75
                                                                                                                                                          block  ;; label = @76
                                                                                                                                                            block  ;; label = @77
                                                                                                                                                              block  ;; label = @78
                                                                                                                                                                block  ;; label = @79
                                                                                                                                                                  block  ;; label = @80
                                                                                                                                                                    block  ;; label = @81
                                                                                                                                                                      block  ;; label = @82
                                                                                                                                                                        block  ;; label = @83
                                                                                                                                                                          block  ;; label = @84
                                                                                                                                                                            block  ;; label = @85
                                                                                                                                                                              block  ;; label = @86
                                                                                                                                                                                block  ;; label = @87
                                                                                                                                                                                  block  ;; label = @88
                                                                                                                                                                                    block  ;; label = @89
                                                                                                                                                                                      block  ;; label = @90
                                                                                                                                                                                        block  ;; label = @91
                                                                                                                                                                                          block  ;; label = @92
                                                                                                                                                                                            block  ;; label = @93
                                                                                                                                                                                              block  ;; label = @94
                                                                                                                                                                                                block  ;; label = @95
                                                                                                                                                                                                  block  ;; label = @96
                                                                                                                                                                                                    block  ;; label = @97
                                                                                                                                                                                                      block  ;; label = @98
                                                                                                                                                                                                        block  ;; label = @99
                                                                                                                                                                                                          block  ;; label = @100
                                                                                                                                                                                                            block  ;; label = @101
                                                                                                                                                                                                              block  ;; label = @102
                                                                                                                                                                                                                block  ;; label = @103
                                                                                                                                                                                                                  block  ;; label = @104
                                                                                                                                                                                                                    block  ;; label = @105
                                                                                                                                                                                                                      block  ;; label = @106
                                                                                                                                                                                                                        block  ;; label = @107
                                                                                                                                                                                                                          block  ;; label = @108
                                                                                                                                                                                                                            block  ;; label = @109
                                                                                                                                                                                                                              block  ;; label = @110
                                                                                                                                                                                                                                block  ;; label = @111
                                                                                                                                                                                                                                  block  ;; label = @112
                                                                                                                                                                                                                                    block  ;; label = @113
                                                                                                                                                                                                                                      block  ;; label = @114
                                                                                                                                                                                                                                        block  ;; label = @115
                                                                                                                                                                                                                                          block  ;; label = @116
                                                                                                                                                                                                                                            block  ;; label = @117
                                                                                                                                                                                                                                              block  ;; label = @118
                                                                                                                                                                                                                                                block  ;; label = @119
                                                                                                                                                                                                                                                  block  ;; label = @120
                                                                                                                                                                                                                                                    block  ;; label = @121
                                                                                                                                                                                                                                                      block  ;; label = @122
                                                                                                                                                                                                                                                        block  ;; label = @123
                                                                                                                                                                                                                                                          block  ;; label = @124
                                                                                                                                                                                                                                                            block  ;; label = @125
                                                                                                                                                                                                                                                              block  ;; label = @126
                                                                                                                                                                                                                                                                block  ;; label = @127
                                                                                                                                                                                                                                                                  block  ;; label = @128
                                                                                                                                                                                                                                                                    block  ;; label = @129
                                                                                                                                                                                                                                                                      block  ;; label = @130
                                                                                                                                                                                                                                                                        block  ;; label = @131
                                                                                                                                                                                                                                                                          block  ;; label = @132
                                                                                                                                                                                                                                                                            block  ;; label = @133
                                                                                                                                                                                                                                                                              block  ;; label = @134
                                                                                                                                                                                                                                                                                block  ;; label = @135
                                                                                                                                                                                                                                                                                  block  ;; label = @136
                                                                                                                                                                                                                                                                                    block  ;; label = @137
                                                                                                                                                                                                                                                                                      block  ;; label = @138
                                                                                                                                                                                                                                                                                        block  ;; label = @139
                                                                                                                                                                                                                                                                                          block  ;; label = @140
                                                                                                                                                                                                                                                                                            block  ;; label = @141
                                                                                                                                                                                                                                                                                              block  ;; label = @142
                                                                                                                                                                                                                                                                                                block  ;; label = @143
                                                                                                                                                                                                                                                                                                  block  ;; label = @144
                                                                                                                                                                                                                                                                                                    block  ;; label = @145
                                                                                                                                                                                                                                                                                                      block  ;; label = @146
                                                                                                                                                                                                                                                                                                        block  ;; label = @147
                                                                                                                                                                                                                                                                                                          block  ;; label = @148
                                                                                                                                                                                                                                                                                                            block  ;; label = @149
                                                                                                                                                                                                                                                                                                              block  ;; label = @150
                                                                                                                                                                                                                                                                                                                block  ;; label = @151
                                                                                                                                                                                                                                                                                                                  block  ;; label = @152
                                                                                                                                                                                                                                                                                                                    block  ;; label = @153
                                                                                                                                                                                                                                                                                                                      block  ;; label = @154
                                                                                                                                                                                                                                                                                                                        block  ;; label = @155
                                                                                                                                                                                                                                                                                                                          block  ;; label = @156
                                                                                                                                                                                                                                                                                                                            block  ;; label = @157
                                                                                                                                                                                                                                                                                                                              block  ;; label = @158
                                                                                                                                                                                                                                                                                                                                block  ;; label = @159
                                                                                                                                                                                                                                                                                                                                  block  ;; label = @160
                                                                                                                                                                                                                                                                                                                                    block  ;; label = @161
                                                                                                                                                                                                                                                                                                                                      local.get 0
                                                                                                                                                                                                                                                                                                                                      if  ;; label = @162
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 1 (;@161;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 2
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 2 (;@160;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 3
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 3 (;@159;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 4
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 4 (;@158;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 5
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 5 (;@157;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 6
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 6 (;@156;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 7
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 7 (;@155;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 8
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 8 (;@154;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 9
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 9 (;@153;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 10
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 10 (;@152;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 11
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 11 (;@151;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 12
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 12 (;@150;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 13
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 13 (;@149;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 14
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 14 (;@148;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 15
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 15 (;@147;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 16
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 16 (;@146;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 17
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 17 (;@145;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 18
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 18 (;@144;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 19
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 19 (;@143;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 20
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 20 (;@142;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 21
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 21 (;@141;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 27
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 22 (;@140;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 28
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 23 (;@139;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 29
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 24 (;@138;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 22
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 25 (;@137;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 23
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 26 (;@136;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 24
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 27 (;@135;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 25
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 28 (;@134;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 26
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 29 (;@133;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 30
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 30 (;@132;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 31
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 31 (;@131;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 32
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 32 (;@130;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 33
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 33 (;@129;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 34
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 34 (;@128;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 35
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 35 (;@127;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 36
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 36 (;@126;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 37
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 37 (;@125;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 38
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 38 (;@124;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 39
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 39 (;@123;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 40
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 40 (;@122;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 41
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 41 (;@121;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 42
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 42 (;@120;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 43
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 43 (;@119;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 44
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 44 (;@118;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 45
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 45 (;@117;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 46
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 46 (;@116;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 47
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 47 (;@115;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 48
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 48 (;@114;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 49
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 49 (;@113;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 50
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 50 (;@112;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 51
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 51 (;@111;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 52
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 52 (;@110;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 53
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 53 (;@109;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 54
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 54 (;@108;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 55
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 55 (;@107;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 56
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 56 (;@106;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 57
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 57 (;@105;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 58
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 58 (;@104;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 59
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 59 (;@103;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 60
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 60 (;@102;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 61
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 61 (;@101;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 63
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 62 (;@100;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 64
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 63 (;@99;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 65
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 64 (;@98;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 66
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 65 (;@97;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 67
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 66 (;@96;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 68
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 67 (;@95;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 69
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 68 (;@94;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 70
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 69 (;@93;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 71
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 70 (;@92;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 72
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 71 (;@91;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 73
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 72 (;@90;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 74
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 73 (;@89;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 75
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 74 (;@88;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 76
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 75 (;@87;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 77
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 76 (;@86;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 78
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 77 (;@85;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 79
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 78 (;@84;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 80
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 79 (;@83;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 81
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 80 (;@82;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 82
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 81 (;@81;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 83
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 82 (;@80;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 84
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 83 (;@79;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 85
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 84 (;@78;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 86
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 85 (;@77;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1000
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 86 (;@76;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1001
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 87 (;@75;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1002
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 88 (;@74;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1003
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 89 (;@73;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1500
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 90 (;@72;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1501
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 91 (;@71;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1502
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 92 (;@70;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1503
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 93 (;@69;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1504
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 94 (;@68;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1505
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 95 (;@67;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1506
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 96 (;@66;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1507
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 97 (;@65;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1508
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 98 (;@64;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1509
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 99 (;@63;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1510
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 100 (;@62;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1511
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 101 (;@61;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1512
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 102 (;@60;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1513
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 103 (;@59;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1514
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 104 (;@58;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1515
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 105 (;@57;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1516
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 106 (;@56;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1517
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 107 (;@55;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1518
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 108 (;@54;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1519
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 109 (;@53;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1520
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 110 (;@52;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1521
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 111 (;@51;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1522
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 112 (;@50;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1523
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 113 (;@49;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1524
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 114 (;@48;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1525
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 115 (;@47;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1526
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 116 (;@46;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1527
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 117 (;@45;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1528
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 118 (;@44;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1529
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 119 (;@43;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1530
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 120 (;@42;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1531
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 121 (;@41;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1532
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 122 (;@40;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1533
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 123 (;@39;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1534
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 124 (;@38;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1535
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 125 (;@37;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1536
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 126 (;@36;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1537
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 127 (;@35;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1538
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 128 (;@34;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1539
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 129 (;@33;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1540
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 130 (;@32;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1541
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 131 (;@31;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1542
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 132 (;@30;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1543
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 133 (;@29;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1544
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 134 (;@28;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1545
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 135 (;@27;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1546
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 136 (;@26;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1547
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 137 (;@25;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1548
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 138 (;@24;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1549
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 139 (;@23;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1550
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 140 (;@22;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1551
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 141 (;@21;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1552
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 142 (;@20;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1553
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 143 (;@19;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1554
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 144 (;@18;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1555
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 145 (;@17;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1556
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 146 (;@16;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1557
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 147 (;@15;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1558
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 148 (;@14;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1559
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 149 (;@13;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1560
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 150 (;@12;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1561
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 151 (;@11;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1562
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 152 (;@10;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 1563
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 153 (;@9;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 2500
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 154 (;@8;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 2501
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 155 (;@7;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 2502
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 156 (;@6;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 2503
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 157 (;@5;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 2504
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 158 (;@4;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 2505
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 159 (;@3;)
                                                                                                                                                                                                                                                                                                                                        local.get 0
                                                                                                                                                                                                                                                                                                                                        i32.const 2506
                                                                                                                                                                                                                                                                                                                                        i32.eq
                                                                                                                                                                                                                                                                                                                                        br_if 160 (;@2;)
                                                                                                                                                                                                                                                                                                                                        br 161 (;@1;)
                                                                                                                                                                                                                                                                                                                                      end
                                                                                                                                                                                                                                                                                                                                      i32.const 1
                                                                                                                                                                                                                                                                                                                                      return
                                                                                                                                                                                                                                                                                                                                    end
                                                                                                                                                                                                                                                                                                                                    i32.const 0
                                                                                                                                                                                                                                                                                                                                    return
                                                                                                                                                                                                                                                                                                                                  end
                                                                                                                                                                                                                                                                                                                                  i32.const 48
                                                                                                                                                                                                                                                                                                                                  return
                                                                                                                                                                                                                                                                                                                                end
                                                                                                                                                                                                                                                                                                                                i32.const 49
                                                                                                                                                                                                                                                                                                                                return
                                                                                                                                                                                                                                                                                                                              end
                                                                                                                                                                                                                                                                                                                              i32.const 50
                                                                                                                                                                                                                                                                                                                              return
                                                                                                                                                                                                                                                                                                                            end
                                                                                                                                                                                                                                                                                                                            i32.const 51
                                                                                                                                                                                                                                                                                                                            return
                                                                                                                                                                                                                                                                                                                          end
                                                                                                                                                                                                                                                                                                                          i32.const 13
                                                                                                                                                                                                                                                                                                                          return
                                                                                                                                                                                                                                                                                                                        end
                                                                                                                                                                                                                                                                                                                        i32.const 52
                                                                                                                                                                                                                                                                                                                        return
                                                                                                                                                                                                                                                                                                                      end
                                                                                                                                                                                                                                                                                                                      i32.const 53
                                                                                                                                                                                                                                                                                                                      return
                                                                                                                                                                                                                                                                                                                    end
                                                                                                                                                                                                                                                                                                                    i32.const 54
                                                                                                                                                                                                                                                                                                                    return
                                                                                                                                                                                                                                                                                                                  end
                                                                                                                                                                                                                                                                                                                  i32.const 55
                                                                                                                                                                                                                                                                                                                  return
                                                                                                                                                                                                                                                                                                                end
                                                                                                                                                                                                                                                                                                                i32.const 56
                                                                                                                                                                                                                                                                                                                return
                                                                                                                                                                                                                                                                                                              end
                                                                                                                                                                                                                                                                                                              i32.const 57
                                                                                                                                                                                                                                                                                                              return
                                                                                                                                                                                                                                                                                                            end
                                                                                                                                                                                                                                                                                                            i32.const 59
                                                                                                                                                                                                                                                                                                            return
                                                                                                                                                                                                                                                                                                          end
                                                                                                                                                                                                                                                                                                          i32.const 60
                                                                                                                                                                                                                                                                                                          return
                                                                                                                                                                                                                                                                                                        end
                                                                                                                                                                                                                                                                                                        i32.const 62
                                                                                                                                                                                                                                                                                                        return
                                                                                                                                                                                                                                                                                                      end
                                                                                                                                                                                                                                                                                                      i32.const 64
                                                                                                                                                                                                                                                                                                      return
                                                                                                                                                                                                                                                                                                    end
                                                                                                                                                                                                                                                                                                    i32.const 66
                                                                                                                                                                                                                                                                                                    return
                                                                                                                                                                                                                                                                                                  end
                                                                                                                                                                                                                                                                                                  i32.const 3
                                                                                                                                                                                                                                                                                                  return
                                                                                                                                                                                                                                                                                                end
                                                                                                                                                                                                                                                                                                i32.const 68
                                                                                                                                                                                                                                                                                                return
                                                                                                                                                                                                                                                                                              end
                                                                                                                                                                                                                                                                                              i32.const 70
                                                                                                                                                                                                                                                                                              return
                                                                                                                                                                                                                                                                                            end
                                                                                                                                                                                                                                                                                            i32.const 75
                                                                                                                                                                                                                                                                                            return
                                                                                                                                                                                                                                                                                          end
                                                                                                                                                                                                                                                                                          i32.const 76
                                                                                                                                                                                                                                                                                          return
                                                                                                                                                                                                                                                                                        end
                                                                                                                                                                                                                                                                                        i32.const 77
                                                                                                                                                                                                                                                                                        return
                                                                                                                                                                                                                                                                                      end
                                                                                                                                                                                                                                                                                      i32.const 78
                                                                                                                                                                                                                                                                                      return
                                                                                                                                                                                                                                                                                    end
                                                                                                                                                                                                                                                                                    i32.const 79
                                                                                                                                                                                                                                                                                    return
                                                                                                                                                                                                                                                                                  end
                                                                                                                                                                                                                                                                                  i32.const 67
                                                                                                                                                                                                                                                                                  return
                                                                                                                                                                                                                                                                                end
                                                                                                                                                                                                                                                                                i32.const 83
                                                                                                                                                                                                                                                                                return
                                                                                                                                                                                                                                                                              end
                                                                                                                                                                                                                                                                              i32.const 84
                                                                                                                                                                                                                                                                              return
                                                                                                                                                                                                                                                                            end
                                                                                                                                                                                                                                                                            i32.const 85
                                                                                                                                                                                                                                                                            return
                                                                                                                                                                                                                                                                          end
                                                                                                                                                                                                                                                                          i32.const 61
                                                                                                                                                                                                                                                                          return
                                                                                                                                                                                                                                                                        end
                                                                                                                                                                                                                                                                        i32.const 63
                                                                                                                                                                                                                                                                        return
                                                                                                                                                                                                                                                                      end
                                                                                                                                                                                                                                                                      i32.const 65
                                                                                                                                                                                                                                                                      return
                                                                                                                                                                                                                                                                    end
                                                                                                                                                                                                                                                                    i32.const 86
                                                                                                                                                                                                                                                                    return
                                                                                                                                                                                                                                                                  end
                                                                                                                                                                                                                                                                  i32.const 71
                                                                                                                                                                                                                                                                  return
                                                                                                                                                                                                                                                                end
                                                                                                                                                                                                                                                                i32.const 91
                                                                                                                                                                                                                                                                return
                                                                                                                                                                                                                                                              end
                                                                                                                                                                                                                                                              i32.const 72
                                                                                                                                                                                                                                                              return
                                                                                                                                                                                                                                                            end
                                                                                                                                                                                                                                                            i32.const 91
                                                                                                                                                                                                                                                            return
                                                                                                                                                                                                                                                          end
                                                                                                                                                                                                                                                          i32.const 92
                                                                                                                                                                                                                                                          return
                                                                                                                                                                                                                                                        end
                                                                                                                                                                                                                                                        i32.const 95
                                                                                                                                                                                                                                                        return
                                                                                                                                                                                                                                                      end
                                                                                                                                                                                                                                                      i32.const 97
                                                                                                                                                                                                                                                      return
                                                                                                                                                                                                                                                    end
                                                                                                                                                                                                                                                    i32.const 98
                                                                                                                                                                                                                                                    return
                                                                                                                                                                                                                                                  end
                                                                                                                                                                                                                                                  i32.const 99
                                                                                                                                                                                                                                                  return
                                                                                                                                                                                                                                                end
                                                                                                                                                                                                                                                i32.const 100
                                                                                                                                                                                                                                                return
                                                                                                                                                                                                                                              end
                                                                                                                                                                                                                                              i32.const 101
                                                                                                                                                                                                                                              return
                                                                                                                                                                                                                                            end
                                                                                                                                                                                                                                            i32.const 102
                                                                                                                                                                                                                                            return
                                                                                                                                                                                                                                          end
                                                                                                                                                                                                                                          i32.const 103
                                                                                                                                                                                                                                          return
                                                                                                                                                                                                                                        end
                                                                                                                                                                                                                                        i32.const 31
                                                                                                                                                                                                                                        return
                                                                                                                                                                                                                                      end
                                                                                                                                                                                                                                      i32.const 104
                                                                                                                                                                                                                                      return
                                                                                                                                                                                                                                    end
                                                                                                                                                                                                                                    i32.const 105
                                                                                                                                                                                                                                    return
                                                                                                                                                                                                                                  end
                                                                                                                                                                                                                                  i32.const 106
                                                                                                                                                                                                                                  return
                                                                                                                                                                                                                                end
                                                                                                                                                                                                                                i32.const 107
                                                                                                                                                                                                                                return
                                                                                                                                                                                                                              end
                                                                                                                                                                                                                              i32.const 109
                                                                                                                                                                                                                              return
                                                                                                                                                                                                                            end
                                                                                                                                                                                                                            i32.const 89
                                                                                                                                                                                                                            return
                                                                                                                                                                                                                          end
                                                                                                                                                                                                                          i32.const 111
                                                                                                                                                                                                                          return
                                                                                                                                                                                                                        end
                                                                                                                                                                                                                        i32.const 112
                                                                                                                                                                                                                        return
                                                                                                                                                                                                                      end
                                                                                                                                                                                                                      i32.const 117
                                                                                                                                                                                                                      return
                                                                                                                                                                                                                    end
                                                                                                                                                                                                                    i32.const 119
                                                                                                                                                                                                                    return
                                                                                                                                                                                                                  end
                                                                                                                                                                                                                  i32.const 121
                                                                                                                                                                                                                  return
                                                                                                                                                                                                                end
                                                                                                                                                                                                                i32.const 123
                                                                                                                                                                                                                return
                                                                                                                                                                                                              end
                                                                                                                                                                                                              i32.const 124
                                                                                                                                                                                                              return
                                                                                                                                                                                                            end
                                                                                                                                                                                                            i32.const 110
                                                                                                                                                                                                            return
                                                                                                                                                                                                          end
                                                                                                                                                                                                          i32.const 116
                                                                                                                                                                                                          return
                                                                                                                                                                                                        end
                                                                                                                                                                                                        i32.const 120
                                                                                                                                                                                                        return
                                                                                                                                                                                                      end
                                                                                                                                                                                                      i32.const 125
                                                                                                                                                                                                      return
                                                                                                                                                                                                    end
                                                                                                                                                                                                    i32.const 126
                                                                                                                                                                                                    return
                                                                                                                                                                                                  end
                                                                                                                                                                                                  i32.const 124
                                                                                                                                                                                                  return
                                                                                                                                                                                                end
                                                                                                                                                                                                i32.const 108
                                                                                                                                                                                                return
                                                                                                                                                                                              end
                                                                                                                                                                                              i32.const 127
                                                                                                                                                                                              return
                                                                                                                                                                                            end
                                                                                                                                                                                            i32.const 128
                                                                                                                                                                                            return
                                                                                                                                                                                          end
                                                                                                                                                                                          i32.const 129
                                                                                                                                                                                          return
                                                                                                                                                                                        end
                                                                                                                                                                                        i32.const 130
                                                                                                                                                                                        return
                                                                                                                                                                                      end
                                                                                                                                                                                      i32.const 131
                                                                                                                                                                                      return
                                                                                                                                                                                    end
                                                                                                                                                                                    i32.const 132
                                                                                                                                                                                    return
                                                                                                                                                                                  end
                                                                                                                                                                                  i32.const 134
                                                                                                                                                                                  return
                                                                                                                                                                                end
                                                                                                                                                                                i32.const 135
                                                                                                                                                                                return
                                                                                                                                                                              end
                                                                                                                                                                              i32.const 136
                                                                                                                                                                              return
                                                                                                                                                                            end
                                                                                                                                                                            i32.const 137
                                                                                                                                                                            return
                                                                                                                                                                          end
                                                                                                                                                                          i32.const 113
                                                                                                                                                                          return
                                                                                                                                                                        end
                                                                                                                                                                        i32.const 138
                                                                                                                                                                        return
                                                                                                                                                                      end
                                                                                                                                                                      i32.const 118
                                                                                                                                                                      return
                                                                                                                                                                    end
                                                                                                                                                                    i32.const 139
                                                                                                                                                                    return
                                                                                                                                                                  end
                                                                                                                                                                  i32.const 115
                                                                                                                                                                  return
                                                                                                                                                                end
                                                                                                                                                                i32.const 122
                                                                                                                                                                return
                                                                                                                                                              end
                                                                                                                                                              i32.const 140
                                                                                                                                                              return
                                                                                                                                                            end
                                                                                                                                                            i32.const 141
                                                                                                                                                            return
                                                                                                                                                          end
                                                                                                                                                          i32.const 87
                                                                                                                                                          return
                                                                                                                                                        end
                                                                                                                                                        i32.const 88
                                                                                                                                                        return
                                                                                                                                                      end
                                                                                                                                                      i32.const 60
                                                                                                                                                      return
                                                                                                                                                    end
                                                                                                                                                    i32.const 90
                                                                                                                                                    return
                                                                                                                                                  end
                                                                                                                                                  i32.const 142
                                                                                                                                                  return
                                                                                                                                                end
                                                                                                                                                i32.const 143
                                                                                                                                                return
                                                                                                                                              end
                                                                                                                                              i32.const 89
                                                                                                                                              return
                                                                                                                                            end
                                                                                                                                            i32.const 145
                                                                                                                                            return
                                                                                                                                          end
                                                                                                                                          i32.const 148
                                                                                                                                          return
                                                                                                                                        end
                                                                                                                                        i32.const 152
                                                                                                                                        return
                                                                                                                                      end
                                                                                                                                      i32.const 151
                                                                                                                                      return
                                                                                                                                    end
                                                                                                                                    i32.const 168
                                                                                                                                    return
                                                                                                                                  end
                                                                                                                                  i32.const 173
                                                                                                                                  return
                                                                                                                                end
                                                                                                                                i32.const 175
                                                                                                                                return
                                                                                                                              end
                                                                                                                              i32.const 183
                                                                                                                              return
                                                                                                                            end
                                                                                                                            i32.const 167
                                                                                                                            return
                                                                                                                          end
                                                                                                                          i32.const 185
                                                                                                                          return
                                                                                                                        end
                                                                                                                        i32.const 179
                                                                                                                        return
                                                                                                                      end
                                                                                                                      i32.const 186
                                                                                                                      return
                                                                                                                    end
                                                                                                                    i32.const 156
                                                                                                                    return
                                                                                                                  end
                                                                                                                  i32.const 31
                                                                                                                  return
                                                                                                                end
                                                                                                                i32.const 191
                                                                                                                return
                                                                                                              end
                                                                                                              i32.const 144
                                                                                                              return
                                                                                                            end
                                                                                                            i32.const 163
                                                                                                            return
                                                                                                          end
                                                                                                          i32.const 146
                                                                                                          return
                                                                                                        end
                                                                                                        i32.const 172
                                                                                                        return
                                                                                                      end
                                                                                                      i32.const 162
                                                                                                      return
                                                                                                    end
                                                                                                    i32.const 190
                                                                                                    return
                                                                                                  end
                                                                                                  i32.const 154
                                                                                                  return
                                                                                                end
                                                                                                i32.const 193
                                                                                                return
                                                                                              end
                                                                                              i32.const 149
                                                                                              return
                                                                                            end
                                                                                            i32.const 150
                                                                                            return
                                                                                          end
                                                                                          i32.const 196
                                                                                          return
                                                                                        end
                                                                                        i32.const 155
                                                                                        return
                                                                                      end
                                                                                      i32.const 153
                                                                                      return
                                                                                    end
                                                                                    i32.const 187
                                                                                    return
                                                                                  end
                                                                                  i32.const 192
                                                                                  return
                                                                                end
                                                                                i32.const 180
                                                                                return
                                                                              end
                                                                              i32.const 161
                                                                              return
                                                                            end
                                                                            i32.const 197
                                                                            return
                                                                          end
                                                                          i32.const 159
                                                                          return
                                                                        end
                                                                        i32.const 158
                                                                        return
                                                                      end
                                                                      i32.const 169
                                                                      return
                                                                    end
                                                                    i32.const 171
                                                                    return
                                                                  end
                                                                  i32.const 170
                                                                  return
                                                                end
                                                                i32.const 157
                                                                return
                                                              end
                                                              i32.const 166
                                                              return
                                                            end
                                                            i32.const 188
                                                            return
                                                          end
                                                          i32.const 182
                                                          return
                                                        end
                                                        i32.const 189
                                                        return
                                                      end
                                                      i32.const 31
                                                      return
                                                    end
                                                    i32.const 160
                                                    return
                                                  end
                                                  i32.const 31
                                                  return
                                                end
                                                i32.const 174
                                                return
                                              end
                                              i32.const 147
                                              return
                                            end
                                            i32.const 181
                                            return
                                          end
                                          i32.const 199
                                          return
                                        end
                                        i32.const 177
                                        return
                                      end
                                      i32.const 178
                                      return
                                    end
                                    i32.const 176
                                    return
                                  end
                                  i32.const 165
                                  return
                                end
                                i32.const 194
                                return
                              end
                              i32.const 164
                              return
                            end
                            i32.const 200
                            return
                          end
                          i32.const 184
                          return
                        end
                        i32.const 195
                        return
                      end
                      i32.const 201
                      return
                    end
                    i32.const 198
                    return
                  end
                  i32.const 202
                  return
                end
                i32.const 205
                return
              end
              i32.const 203
              return
            end
            i32.const 204
            return
          end
          i32.const 206
          return
        end
        i32.const 207
        return
      end
      i32.const 208
      return
    end
    i32.const 0)
  (func $node_modules/@graphprotocol/graph-ts/global/global/allocate (type 0) (param i32) (result i32)
    local.get 0
    call $~lib/rt/stub/__alloc)
  (func $~start (type 5)
    (local i32 i32 i32)
    global.get $~started
    if  ;; label = @1
      return
    end
    i32.const 1
    global.set $~started
    i32.const 15580
    global.set $~lib/rt/stub/offset
    i32.const 0
    call $~lib/rt/stub/__alloc
    drop
    i32.const 4
    i32.const 4
    call $~lib/rt/stub/__new
    call $~lib/@graphprotocol/graph-ts/common/collections/Entity#constructor
    drop
    i32.const 1824
    call $~lib/@graphprotocol/graph-ts/common/conversion/typeConversion.stringToH160
    drop
    i32.const 1
    call $~lib/@graphprotocol/graph-ts/common/collections/ByteArray.fromI32
    drop
    i32.const 1
    call $~lib/@graphprotocol/graph-ts/common/collections/ByteArray.fromI32
    drop
    i32.const 1
    call $~lib/@graphprotocol/graph-ts/common/collections/ByteArray.fromI32
    global.set $modules/airstack/common/index/BIGINT_ONE
    i32.const 0
    call $~lib/@graphprotocol/graph-ts/common/collections/ByteArray.fromI32
    global.set $modules/airstack/common/index/BIG_INT_ZERO
    i32.const 4
    i32.const 15
    call $~lib/rt/stub/__new
    local.tee 1
    i32.const 0
    i32.store
    i32.const 16
    i32.const 17
    call $~lib/rt/stub/__new
    local.tee 0
    i32.const 0
    i32.store
    local.get 0
    i32.const 0
    i32.store offset=4
    local.get 0
    i32.const 0
    i32.store offset=8
    local.get 0
    i32.const 0
    i32.store offset=12
    i32.const 32
    i32.const 0
    call $~lib/rt/stub/__new
    local.tee 2
    i32.const 32
    call $~lib/memory/memory.fill
    local.get 0
    local.get 2
    i32.store
    local.get 0
    local.get 2
    i32.store offset=4
    local.get 0
    i32.const 32
    i32.store offset=8
    local.get 0
    i32.const 0
    i32.store offset=12
    local.get 1
    local.get 0
    i32.store
    local.get 1
    global.set $modules/airstack/common/index/AIR_NETWORK_MAP
    global.get $modules/airstack/common/index/AIR_NETWORK_MAP
    i32.const 3456
    i32.const 3504
    call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/string/String>#set
    global.get $modules/airstack/common/index/AIR_NETWORK_MAP
    i32.const 3680
    i32.const 3744
    call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/string/String>#set
    global.get $modules/airstack/common/index/AIR_NETWORK_MAP
    i32.const 3808
    i32.const 3840
    call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/string/String>#set
    global.get $modules/airstack/common/index/AIR_NETWORK_MAP
    i32.const 3872
    i32.const 3920
    call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/string/String>#set
    global.get $modules/airstack/common/index/AIR_NETWORK_MAP
    i32.const 3968
    i32.const 4000
    call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/string/String>#set
    global.get $modules/airstack/common/index/AIR_NETWORK_MAP
    i32.const 4032
    i32.const 4064
    call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/string/String>#set
    global.get $modules/airstack/common/index/AIR_NETWORK_MAP
    i32.const 4096
    i32.const 4128
    call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/string/String>#set
    global.get $modules/airstack/common/index/AIR_NETWORK_MAP
    i32.const 4160
    i32.const 4160
    call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/string/String>#set
    global.get $modules/airstack/common/index/AIR_NETWORK_MAP
    i32.const 4192
    i32.const 4192
    call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/string/String>#set
    global.get $modules/airstack/common/index/AIR_NETWORK_MAP
    i32.const 1680
    i32.const 4224
    call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/string/String>#set
    global.get $modules/airstack/common/index/AIR_NETWORK_MAP
    i32.const 4272
    i32.const 4304
    call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/string/String>#set
    global.get $modules/airstack/common/index/AIR_NETWORK_MAP
    i32.const 4336
    i32.const 4368
    call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/string/String>#set
    global.get $modules/airstack/common/index/AIR_NETWORK_MAP
    i32.const 4400
    i32.const 4448
    call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/string/String>#set
    global.get $modules/airstack/common/index/AIR_NETWORK_MAP
    i32.const 4496
    i32.const 4528
    call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/string/String>#set
    global.get $modules/airstack/common/index/AIR_NETWORK_MAP
    i32.const 4560
    i32.const 4608
    call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/string/String>#set
    global.get $modules/airstack/common/index/AIR_NETWORK_MAP
    i32.const 4656
    i32.const 4704
    call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/string/String>#set
    global.get $modules/airstack/common/index/AIR_NETWORK_MAP
    i32.const 4752
    i32.const 4800
    call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/string/String>#set
    global.get $modules/airstack/common/index/AIR_NETWORK_MAP
    i32.const 4848
    i32.const 4896
    call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/string/String>#set
    global.get $modules/airstack/common/index/AIR_NETWORK_MAP
    i32.const 4944
    i32.const 4992
    call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/string/String>#set
    global.get $modules/airstack/common/index/AIR_NETWORK_MAP
    i32.const 5040
    i32.const 5072
    call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/string/String>#set
    global.get $modules/airstack/common/index/AIR_NETWORK_MAP
    i32.const 5104
    i32.const 5136
    call $~lib/@graphprotocol/graph-ts/common/collections/TypedMap<~lib/string/String_~lib/string/String>#set
    i32.const 4
    i32.const 4
    call $~lib/rt/stub/__new
    call $~lib/@graphprotocol/graph-ts/common/collections/Entity#constructor
    drop
    i32.const 1824
    call $~lib/@graphprotocol/graph-ts/common/conversion/typeConversion.stringToH160
    global.set $~lib/matchstick-as/defaults/defaultAddress
    global.get $~lib/matchstick-as/defaults/defaultAddress
    global.set $~lib/matchstick-as/defaults/defaultAddressBytes
    i32.const 1
    call $~lib/@graphprotocol/graph-ts/common/collections/ByteArray.fromI32
    global.set $~lib/matchstick-as/defaults/defaultBigInt
    i32.const 1
    call $~lib/@graphprotocol/graph-ts/common/collections/ByteArray.fromI32
    global.set $~lib/matchstick-as/defaults/defaultIntBytes
    i32.const 5280
    i32.const 15456
    i32.load
    call $~lib/matchstick-as/assembly/index/_registerDescribe
    i32.const 0
    call $~lib/rt/stub/__alloc
    drop)
  (table $0 6 funcref)
  (memory (;0;) 1)
  (global $~lib/rt/stub/offset (mut i32) (i32.const 0))
  (global $modules/airstack/common/index/BIGINT_ONE (mut i32) (i32.const 0))
  (global $modules/airstack/common/index/BIG_INT_ZERO (mut i32) (i32.const 0))
  (global $modules/airstack/common/index/AIR_NETWORK_MAP (mut i32) (i32.const 0))
  (global $~lib/matchstick-as/defaults/defaultAddress (mut i32) (i32.const 0))
  (global $~lib/matchstick-as/defaults/defaultAddressBytes (mut i32) (i32.const 0))
  (global $~lib/matchstick-as/defaults/defaultBigInt (mut i32) (i32.const 0))
  (global $~lib/matchstick-as/defaults/defaultIntBytes (mut i32) (i32.const 0))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.String i32 (i32.const 0))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.ArrayBuffer i32 (i32.const 1))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.Int8Array i32 (i32.const 2))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.Int16Array i32 (i32.const 3))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.Int32Array i32 (i32.const 4))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.Int64Array i32 (i32.const 5))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.Uint8Array i32 (i32.const 6))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.Uint16Array i32 (i32.const 7))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.Uint32Array i32 (i32.const 8))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.Uint64Array i32 (i32.const 9))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.Float32Array i32 (i32.const 10))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.Float64Array i32 (i32.const 11))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.BigDecimal i32 (i32.const 12))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.ArrayBool i32 (i32.const 13))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.ArrayUint8Array i32 (i32.const 14))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.ArrayEthereumValue i32 (i32.const 15))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.ArrayStoreValue i32 (i32.const 16))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.ArrayJsonValue i32 (i32.const 17))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.ArrayString i32 (i32.const 18))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.ArrayEventParam i32 (i32.const 19))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.ArrayTypedMapEntryStringJsonValue i32 (i32.const 20))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.ArrayTypedMapEntryStringStoreValue i32 (i32.const 21))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.SmartContractCall i32 (i32.const 22))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.EventParam i32 (i32.const 23))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.EthereumTransaction i32 (i32.const 24))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.EthereumBlock i32 (i32.const 25))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.EthereumCall i32 (i32.const 26))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.WrappedTypedMapStringJsonValue i32 (i32.const 27))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.WrappedBool i32 (i32.const 28))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.WrappedJsonValue i32 (i32.const 29))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.EthereumValue i32 (i32.const 30))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.StoreValue i32 (i32.const 31))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.JsonValue i32 (i32.const 32))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.EthereumEvent i32 (i32.const 33))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.TypedMapEntryStringStoreValue i32 (i32.const 34))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.TypedMapEntryStringJsonValue i32 (i32.const 35))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.TypedMapStringStoreValue i32 (i32.const 36))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.TypedMapStringJsonValue i32 (i32.const 37))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.TypedMapStringTypedMapStringJsonValue i32 (i32.const 38))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.ResultTypedMapStringJsonValueBool i32 (i32.const 39))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.ResultJsonValueBool i32 (i32.const 40))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.ArrayU8 i32 (i32.const 41))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.ArrayU16 i32 (i32.const 42))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.ArrayU32 i32 (i32.const 43))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.ArrayU64 i32 (i32.const 44))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.ArrayI8 i32 (i32.const 45))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.ArrayI16 i32 (i32.const 46))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.ArrayI32 i32 (i32.const 47))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.ArrayI64 i32 (i32.const 48))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.ArrayF32 i32 (i32.const 49))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.ArrayF64 i32 (i32.const 50))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.ArrayBigDecimal i32 (i32.const 51))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.NearArrayDataReceiver i32 (i32.const 52))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.NearArrayCryptoHash i32 (i32.const 53))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.NearArrayActionValue i32 (i32.const 54))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.NearMerklePath i32 (i32.const 55))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.NearArrayValidatorStake i32 (i32.const 56))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.NearArraySlashedValidator i32 (i32.const 57))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.NearArraySignature i32 (i32.const 58))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.NearArrayChunkHeader i32 (i32.const 59))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.NearAccessKeyPermissionValue i32 (i32.const 60))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.NearActionValue i32 (i32.const 61))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.NearDirection i32 (i32.const 62))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.NearPublicKey i32 (i32.const 63))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.NearSignature i32 (i32.const 64))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.NearFunctionCallPermission i32 (i32.const 65))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.NearFullAccessPermission i32 (i32.const 66))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.NearAccessKey i32 (i32.const 67))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.NearDataReceiver i32 (i32.const 68))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.NearCreateAccountAction i32 (i32.const 69))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.NearDeployContractAction i32 (i32.const 70))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.NearFunctionCallAction i32 (i32.const 71))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.NearTransferAction i32 (i32.const 72))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.NearStakeAction i32 (i32.const 73))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.NearAddKeyAction i32 (i32.const 74))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.NearDeleteKeyAction i32 (i32.const 75))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.NearDeleteAccountAction i32 (i32.const 76))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.NearActionReceipt i32 (i32.const 77))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.NearSuccessStatus i32 (i32.const 78))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.NearMerklePathItem i32 (i32.const 79))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.NearExecutionOutcome i32 (i32.const 80))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.NearSlashedValidator i32 (i32.const 81))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.NearBlockHeader i32 (i32.const 82))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.NearValidatorStake i32 (i32.const 83))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.NearChunkHeader i32 (i32.const 84))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.NearBlock i32 (i32.const 85))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.NearReceiptWithOutcome i32 (i32.const 86))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.TransactionReceipt i32 (i32.const 1000))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.Log i32 (i32.const 1001))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.ArrayH256 i32 (i32.const 1002))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.ArrayLog i32 (i32.const 1003))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosAny i32 (i32.const 1500))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosAnyArray i32 (i32.const 1501))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosBytesArray i32 (i32.const 1502))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosCoinArray i32 (i32.const 1503))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosCommitSigArray i32 (i32.const 1504))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosEventArray i32 (i32.const 1505))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosEventAttributeArray i32 (i32.const 1506))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosEvidenceArray i32 (i32.const 1507))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosModeInfoArray i32 (i32.const 1508))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosSignerInfoArray i32 (i32.const 1509))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosTxResultArray i32 (i32.const 1510))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosValidatorArray i32 (i32.const 1511))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosValidatorUpdateArray i32 (i32.const 1512))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosAuthInfo i32 (i32.const 1513))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosBlock i32 (i32.const 1514))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosBlockId i32 (i32.const 1515))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosBlockIdFlagEnum i32 (i32.const 1516))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosBlockParams i32 (i32.const 1517))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosCoin i32 (i32.const 1518))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosCommit i32 (i32.const 1519))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosCommitSig i32 (i32.const 1520))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosCompactBitArray i32 (i32.const 1521))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosConsensus i32 (i32.const 1522))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosConsensusParams i32 (i32.const 1523))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosDuplicateVoteEvidence i32 (i32.const 1524))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosDuration i32 (i32.const 1525))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosEvent i32 (i32.const 1526))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosEventAttribute i32 (i32.const 1527))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosEventData i32 (i32.const 1528))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosEventVote i32 (i32.const 1529))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosEvidence i32 (i32.const 1530))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosEvidenceList i32 (i32.const 1531))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosEvidenceParams i32 (i32.const 1532))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosFee i32 (i32.const 1533))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosHeader i32 (i32.const 1534))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosHeaderOnlyBlock i32 (i32.const 1535))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosLightBlock i32 (i32.const 1536))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosLightClientAttackEvidence i32 (i32.const 1537))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosModeInfo i32 (i32.const 1538))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosModeInfoMulti i32 (i32.const 1539))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosModeInfoSingle i32 (i32.const 1540))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosPartSetHeader i32 (i32.const 1541))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosPublicKey i32 (i32.const 1542))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosResponseBeginBlock i32 (i32.const 1543))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosResponseDeliverTx i32 (i32.const 1544))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosResponseEndBlock i32 (i32.const 1545))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosSignModeEnum i32 (i32.const 1546))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosSignedHeader i32 (i32.const 1547))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosSignedMsgTypeEnum i32 (i32.const 1548))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosSignerInfo i32 (i32.const 1549))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosTimestamp i32 (i32.const 1550))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosTip i32 (i32.const 1551))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosTransactionData i32 (i32.const 1552))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosTx i32 (i32.const 1553))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosTxBody i32 (i32.const 1554))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosTxResult i32 (i32.const 1555))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosValidator i32 (i32.const 1556))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosValidatorParams i32 (i32.const 1557))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosValidatorSet i32 (i32.const 1558))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosValidatorSetUpdates i32 (i32.const 1559))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosValidatorUpdate i32 (i32.const 1560))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosVersionParams i32 (i32.const 1561))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosMessageData i32 (i32.const 1562))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.CosmosTransactionContext i32 (i32.const 1563))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.ArweaveBlock i32 (i32.const 2500))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.ArweaveProofOfAccess i32 (i32.const 2501))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.ArweaveTag i32 (i32.const 2502))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.ArweaveTagArray i32 (i32.const 2503))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.ArweaveTransaction i32 (i32.const 2504))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.ArweaveTransactionArray i32 (i32.const 2505))
  (global $node_modules/@graphprotocol/graph-ts/global/global/TypeId.ArweaveTransactionWithBlockPtr i32 (i32.const 2506))
  (global $~started (mut i32) (i32.const 0))
  (export "TypeId.String" (global 8))
  (export "TypeId.ArrayBuffer" (global 9))
  (export "TypeId.Int8Array" (global 10))
  (export "TypeId.Int16Array" (global 11))
  (export "TypeId.Int32Array" (global 12))
  (export "TypeId.Int64Array" (global 13))
  (export "TypeId.Uint8Array" (global 14))
  (export "TypeId.Uint16Array" (global 15))
  (export "TypeId.Uint32Array" (global 16))
  (export "TypeId.Uint64Array" (global 17))
  (export "TypeId.Float32Array" (global 18))
  (export "TypeId.Float64Array" (global 19))
  (export "TypeId.BigDecimal" (global 20))
  (export "TypeId.ArrayBool" (global 21))
  (export "TypeId.ArrayUint8Array" (global 22))
  (export "TypeId.ArrayEthereumValue" (global 23))
  (export "TypeId.ArrayStoreValue" (global 24))
  (export "TypeId.ArrayJsonValue" (global 25))
  (export "TypeId.ArrayString" (global 26))
  (export "TypeId.ArrayEventParam" (global 27))
  (export "TypeId.ArrayTypedMapEntryStringJsonValue" (global 28))
  (export "TypeId.ArrayTypedMapEntryStringStoreValue" (global 29))
  (export "TypeId.SmartContractCall" (global 30))
  (export "TypeId.EventParam" (global 31))
  (export "TypeId.EthereumTransaction" (global 32))
  (export "TypeId.EthereumBlock" (global 33))
  (export "TypeId.EthereumCall" (global 34))
  (export "TypeId.WrappedTypedMapStringJsonValue" (global 35))
  (export "TypeId.WrappedBool" (global 36))
  (export "TypeId.WrappedJsonValue" (global 37))
  (export "TypeId.EthereumValue" (global 38))
  (export "TypeId.StoreValue" (global 39))
  (export "TypeId.JsonValue" (global 40))
  (export "TypeId.EthereumEvent" (global 41))
  (export "TypeId.TypedMapEntryStringStoreValue" (global 42))
  (export "TypeId.TypedMapEntryStringJsonValue" (global 43))
  (export "TypeId.TypedMapStringStoreValue" (global 44))
  (export "TypeId.TypedMapStringJsonValue" (global 45))
  (export "TypeId.TypedMapStringTypedMapStringJsonValue" (global 46))
  (export "TypeId.ResultTypedMapStringJsonValueBool" (global 47))
  (export "TypeId.ResultJsonValueBool" (global 48))
  (export "TypeId.ArrayU8" (global 49))
  (export "TypeId.ArrayU16" (global 50))
  (export "TypeId.ArrayU32" (global 51))
  (export "TypeId.ArrayU64" (global 52))
  (export "TypeId.ArrayI8" (global 53))
  (export "TypeId.ArrayI16" (global 54))
  (export "TypeId.ArrayI32" (global 55))
  (export "TypeId.ArrayI64" (global 56))
  (export "TypeId.ArrayF32" (global 57))
  (export "TypeId.ArrayF64" (global 58))
  (export "TypeId.ArrayBigDecimal" (global 59))
  (export "TypeId.NearArrayDataReceiver" (global 60))
  (export "TypeId.NearArrayCryptoHash" (global 61))
  (export "TypeId.NearArrayActionValue" (global 62))
  (export "TypeId.NearMerklePath" (global 63))
  (export "TypeId.NearArrayValidatorStake" (global 64))
  (export "TypeId.NearArraySlashedValidator" (global 65))
  (export "TypeId.NearArraySignature" (global 66))
  (export "TypeId.NearArrayChunkHeader" (global 67))
  (export "TypeId.NearAccessKeyPermissionValue" (global 68))
  (export "TypeId.NearActionValue" (global 69))
  (export "TypeId.NearDirection" (global 70))
  (export "TypeId.NearPublicKey" (global 71))
  (export "TypeId.NearSignature" (global 72))
  (export "TypeId.NearFunctionCallPermission" (global 73))
  (export "TypeId.NearFullAccessPermission" (global 74))
  (export "TypeId.NearAccessKey" (global 75))
  (export "TypeId.NearDataReceiver" (global 76))
  (export "TypeId.NearCreateAccountAction" (global 77))
  (export "TypeId.NearDeployContractAction" (global 78))
  (export "TypeId.NearFunctionCallAction" (global 79))
  (export "TypeId.NearTransferAction" (global 80))
  (export "TypeId.NearStakeAction" (global 81))
  (export "TypeId.NearAddKeyAction" (global 82))
  (export "TypeId.NearDeleteKeyAction" (global 83))
  (export "TypeId.NearDeleteAccountAction" (global 84))
  (export "TypeId.NearActionReceipt" (global 85))
  (export "TypeId.NearSuccessStatus" (global 86))
  (export "TypeId.NearMerklePathItem" (global 87))
  (export "TypeId.NearExecutionOutcome" (global 88))
  (export "TypeId.NearSlashedValidator" (global 89))
  (export "TypeId.NearBlockHeader" (global 90))
  (export "TypeId.NearValidatorStake" (global 91))
  (export "TypeId.NearChunkHeader" (global 92))
  (export "TypeId.NearBlock" (global 93))
  (export "TypeId.NearReceiptWithOutcome" (global 94))
  (export "TypeId.TransactionReceipt" (global 95))
  (export "TypeId.Log" (global 96))
  (export "TypeId.ArrayH256" (global 97))
  (export "TypeId.ArrayLog" (global 98))
  (export "TypeId.CosmosAny" (global 99))
  (export "TypeId.CosmosAnyArray" (global 100))
  (export "TypeId.CosmosBytesArray" (global 101))
  (export "TypeId.CosmosCoinArray" (global 102))
  (export "TypeId.CosmosCommitSigArray" (global 103))
  (export "TypeId.CosmosEventArray" (global 104))
  (export "TypeId.CosmosEventAttributeArray" (global 105))
  (export "TypeId.CosmosEvidenceArray" (global 106))
  (export "TypeId.CosmosModeInfoArray" (global 107))
  (export "TypeId.CosmosSignerInfoArray" (global 108))
  (export "TypeId.CosmosTxResultArray" (global 109))
  (export "TypeId.CosmosValidatorArray" (global 110))
  (export "TypeId.CosmosValidatorUpdateArray" (global 111))
  (export "TypeId.CosmosAuthInfo" (global 112))
  (export "TypeId.CosmosBlock" (global 113))
  (export "TypeId.CosmosBlockId" (global 114))
  (export "TypeId.CosmosBlockIdFlagEnum" (global 115))
  (export "TypeId.CosmosBlockParams" (global 116))
  (export "TypeId.CosmosCoin" (global 117))
  (export "TypeId.CosmosCommit" (global 118))
  (export "TypeId.CosmosCommitSig" (global 119))
  (export "TypeId.CosmosCompactBitArray" (global 120))
  (export "TypeId.CosmosConsensus" (global 121))
  (export "TypeId.CosmosConsensusParams" (global 122))
  (export "TypeId.CosmosDuplicateVoteEvidence" (global 123))
  (export "TypeId.CosmosDuration" (global 124))
  (export "TypeId.CosmosEvent" (global 125))
  (export "TypeId.CosmosEventAttribute" (global 126))
  (export "TypeId.CosmosEventData" (global 127))
  (export "TypeId.CosmosEventVote" (global 128))
  (export "TypeId.CosmosEvidence" (global 129))
  (export "TypeId.CosmosEvidenceList" (global 130))
  (export "TypeId.CosmosEvidenceParams" (global 131))
  (export "TypeId.CosmosFee" (global 132))
  (export "TypeId.CosmosHeader" (global 133))
  (export "TypeId.CosmosHeaderOnlyBlock" (global 134))
  (export "TypeId.CosmosLightBlock" (global 135))
  (export "TypeId.CosmosLightClientAttackEvidence" (global 136))
  (export "TypeId.CosmosModeInfo" (global 137))
  (export "TypeId.CosmosModeInfoMulti" (global 138))
  (export "TypeId.CosmosModeInfoSingle" (global 139))
  (export "TypeId.CosmosPartSetHeader" (global 140))
  (export "TypeId.CosmosPublicKey" (global 141))
  (export "TypeId.CosmosResponseBeginBlock" (global 142))
  (export "TypeId.CosmosResponseDeliverTx" (global 143))
  (export "TypeId.CosmosResponseEndBlock" (global 144))
  (export "TypeId.CosmosSignModeEnum" (global 145))
  (export "TypeId.CosmosSignedHeader" (global 146))
  (export "TypeId.CosmosSignedMsgTypeEnum" (global 147))
  (export "TypeId.CosmosSignerInfo" (global 148))
  (export "TypeId.CosmosTimestamp" (global 149))
  (export "TypeId.CosmosTip" (global 150))
  (export "TypeId.CosmosTransactionData" (global 151))
  (export "TypeId.CosmosTx" (global 152))
  (export "TypeId.CosmosTxBody" (global 153))
  (export "TypeId.CosmosTxResult" (global 154))
  (export "TypeId.CosmosValidator" (global 155))
  (export "TypeId.CosmosValidatorParams" (global 156))
  (export "TypeId.CosmosValidatorSet" (global 157))
  (export "TypeId.CosmosValidatorSetUpdates" (global 158))
  (export "TypeId.CosmosValidatorUpdate" (global 159))
  (export "TypeId.CosmosVersionParams" (global 160))
  (export "TypeId.CosmosMessageData" (global 161))
  (export "TypeId.CosmosTransactionContext" (global 162))
  (export "TypeId.ArweaveBlock" (global 163))
  (export "TypeId.ArweaveProofOfAccess" (global 164))
  (export "TypeId.ArweaveTag" (global 165))
  (export "TypeId.ArweaveTagArray" (global 166))
  (export "TypeId.ArweaveTransaction" (global 167))
  (export "TypeId.ArweaveTransactionArray" (global 168))
  (export "TypeId.ArweaveTransactionWithBlockPtr" (global 169))
  (export "id_of_type" (func $node_modules/@graphprotocol/graph-ts/global/global/id_of_type))
  (export "allocate" (func $node_modules/@graphprotocol/graph-ts/global/global/allocate))
  (export "memory" (memory 0))
  (export "table" (table 0))
  (export "_start" (func $~start))
  (elem $0 (i32.const 1) func $start:tests/resolver.test~anonymous|0~anonymous|0 $~lib/@graphprotocol/graph-ts/common/value/Value#displayData~anonymous|0 $start:tests/resolver.test~anonymous|0~anonymous|1 $start:tests/resolver.test~anonymous|0~anonymous|2 $start:tests/resolver.test~anonymous|0)
  (data (;0;) (i32.const 1036) "<")
  (data (;1;) (i32.const 1048) "\01\00\00\00(\00\00\00A\00l\00l\00o\00c\00a\00t\00i\00o\00n\00 \00t\00o\00o\00 \00l\00a\00r\00g\00e")
  (data (;2;) (i32.const 1100) "<")
  (data (;3;) (i32.const 1112) "\01\00\00\00\1e\00\00\00~\00l\00i\00b\00/\00r\00t\00/\00s\00t\00u\00b\00.\00t\00s")
  (data (;4;) (i32.const 1164) "\1c")
  (data (;5;) (i32.const 1176) "\01\00\00\00\0c\00\00\00S\00t\00r\00i\00n\00g")
  (data (;6;) (i32.const 1196) "\1c")
  (data (;7;) (i32.const 1208) "\01\00\00\00\06\00\00\00I\00n\00t")
  (data (;8;) (i32.const 1228) ",")
  (data (;9;) (i32.const 1240) "\01\00\00\00\14\00\00\00B\00i\00g\00D\00e\00c\00i\00m\00a\00l")
  (data (;10;) (i32.const 1276) "\1c")
  (data (;11;) (i32.const 1288) "\01\00\00\00\08\00\00\00b\00o\00o\00l")
  (data (;12;) (i32.const 1308) "\1c")
  (data (;13;) (i32.const 1320) "\01\00\00\00\0a\00\00\00A\00r\00r\00a\00y")
  (data (;14;) (i32.const 1340) "\1c")
  (data (;15;) (i32.const 1352) "\01\00\00\00\08\00\00\00n\00u\00l\00l")
  (data (;16;) (i32.const 1372) "\1c")
  (data (;17;) (i32.const 1384) "\01\00\00\00\0a\00\00\00B\00y\00t\00e\00s")
  (data (;18;) (i32.const 1404) "\1c")
  (data (;19;) (i32.const 1416) "\01\00\00\00\0c\00\00\00B\00i\00g\00I\00n\00t")
  (data (;20;) (i32.const 1436) "<")
  (data (;21;) (i32.const 1452) " \00\00\00\a0\04\00\00\c0\04\00\00\e0\04\00\00\10\05\00\000\05\00\00P\05\00\00p\05\00\00\90\05")
  (data (;22;) (i32.const 1500) ",")
  (data (;23;) (i32.const 1512) "\03\00\00\00\10\00\00\00\b0\05\00\00\b0\05\00\00 \00\00\00\08")
  (data (;24;) (i32.const 1548) "l")
  (data (;25;) (i32.const 1560) "\01\00\00\00T\00\00\000\00x\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000")
  (data (;26;) (i32.const 1660) ",")
  (data (;27;) (i32.const 1672) "\01\00\00\00\0e\00\00\00m\00a\00i\00n\00n\00e\00t")
  (data (;28;) (i32.const 1708) ",")
  (data (;29;) (i32.const 1720) "\01\00\00\00\1c\00\00\00I\00n\00v\00a\00l\00i\00d\00 \00l\00e\00n\00g\00t\00h")
  (data (;30;) (i32.const 1756) ",")
  (data (;31;) (i32.const 1768) "\01\00\00\00\1a\00\00\00~\00l\00i\00b\00/\00a\00r\00r\00a\00y\00.\00t\00s")
  (data (;32;) (i32.const 1804) "l")
  (data (;33;) (i32.const 1816) "\01\00\00\00T\00\00\000\00x\00A\001\006\000\008\001\00F\003\006\000\00e\003\008\004\007\000\000\006\00d\00B\006\006\000\00b\00a\00e\001\00c\006\00d\001\00b\002\00e\001\007\00e\00C\002\00A")
  (data (;34;) (i32.const 1916) "<")
  (data (;35;) (i32.const 1928) "\01\00\00\00&\00\00\00~\00l\00i\00b\00/\00a\00r\00r\00a\00y\00b\00u\00f\00f\00e\00r\00.\00t\00s")
  (data (;36;) (i32.const 1980) "<")
  (data (;37;) (i32.const 1992) "\01\00\00\00$\00\00\00I\00n\00d\00e\00x\00 \00o\00u\00t\00 \00o\00f\00 \00r\00a\00n\00g\00e")
  (data (;38;) (i32.const 2044) "<")
  (data (;39;) (i32.const 2056) "\01\00\00\00$\00\00\00~\00l\00i\00b\00/\00t\00y\00p\00e\00d\00a\00r\00r\00a\00y\00.\00t\00s")
  (data (;40;) (i32.const 2108) "<")
  (data (;41;) (i32.const 2120) "\01\00\00\00 \00\00\00d\00e\00f\00a\00u\00l\00t\00_\00l\00o\00g\00_\00t\00y\00p\00e")
  (data (;42;) (i32.const 2172) "\9c")
  (data (;43;) (i32.const 2184) "\01\00\00\00\86\00\00\00Y\00o\00u\00 \00c\00a\00n\00'\00t\00 \00m\00o\00d\00i\00f\00y\00 \00a\00 \00M\00o\00c\00k\00e\00d\00F\00u\00n\00c\00t\00i\00o\00n\00 \00i\00n\00s\00t\00a\00n\00c\00e\00 \00a\00f\00t\00e\00r\00 \00i\00t\00 \00h\00a\00s\00 \00b\00e\00e\00n\00 \00s\00a\00v\00e\00d\00.")
  (data (;44;) (i32.const 2332) "l")
  (data (;45;) (i32.const 2344) "\01\00\00\00N\00\00\00A\00I\00R\00_\00D\00O\00M\00A\00I\00N\00_\00O\00W\00N\00E\00R\00_\00C\00H\00A\00N\00G\00E\00D\00_\00E\00N\00T\00I\00T\00Y\00_\00C\00O\00U\00N\00T\00E\00R")
  (data (;46;) (i32.const 2444) "\5c")
  (data (;47;) (i32.const 2456) "\01\00\00\00D\00\00\00A\00I\00R\00_\00D\00O\00M\00A\00I\00N\00_\00T\00R\00A\00N\00S\00F\00E\00R\00_\00E\00N\00T\00I\00T\00Y\00_\00C\00O\00U\00N\00T\00E\00R")
  (data (;48;) (i32.const 2540) "\5c")
  (data (;49;) (i32.const 2552) "\01\00\00\00L\00\00\00A\00I\00R\00_\00D\00O\00M\00A\00I\00N\00_\00N\00E\00W\00_\00R\00E\00S\00O\00L\00V\00E\00R\00_\00E\00N\00T\00I\00T\00Y\00_\00C\00O\00U\00N\00T\00E\00R")
  (data (;50;) (i32.const 2636) "\5c")
  (data (;51;) (i32.const 2648) "\01\00\00\00L\00\00\00A\00I\00R\00_\00D\00O\00M\00A\00I\00N\00_\00N\00E\00W\00_\00T\00T\00L\00_\00T\00R\00A\00N\00S\00A\00C\00T\00I\00O\00N\00_\00C\00O\00U\00N\00T\00E\00R")
  (data (;52;) (i32.const 2732) "l")
  (data (;53;) (i32.const 2744) "\01\00\00\00N\00\00\00A\00I\00R\00_\00N\00A\00M\00E\00_\00R\00E\00G\00I\00S\00T\00E\00R\00E\00D\00_\00T\00R\00A\00N\00S\00A\00C\00T\00I\00O\00N\00_\00C\00O\00U\00N\00T\00E\00R")
  (data (;54;) (i32.const 2844) "\5c")
  (data (;55;) (i32.const 2856) "\01\00\00\00H\00\00\00A\00I\00R\00_\00N\00A\00M\00E\00_\00R\00E\00N\00E\00W\00E\00D\00_\00T\00R\00A\00N\00S\00A\00C\00T\00I\00O\00N\00_\00C\00O\00U\00N\00T\00E\00R")
  (data (;56;) (i32.const 2940) "\5c")
  (data (;57;) (i32.const 2952) "\01\00\00\00H\00\00\00A\00I\00R\00_\00A\00D\00D\00R\00_\00C\00H\00A\00N\00G\00E\00D\00_\00T\00R\00A\00N\00S\00A\00C\00T\00I\00O\00N\00_\00C\00O\00U\00N\00T\00E\00R")
  (data (;58;) (i32.const 3036) ",")
  (data (;59;) (i32.const 3048) "\01\00\00\00\10\00\00\00A\00I\00R\00_\00M\00E\00T\00A")
  (data (;60;) (i32.const 3084) "\1c")
  (data (;61;) (i32.const 3096) "\01\00\00\00\02\00\00\001")
  (data (;62;) (i32.const 3116) "\9c")
  (data (;63;) (i32.const 3128) "\01\00\00\00\84\00\00\000\00x\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000")
  (data (;64;) (i32.const 3276) "\1c")
  (data (;65;) (i32.const 3288) "\01")
  (data (;66;) (i32.const 3308) "\1c")
  (data (;67;) (i32.const 3320) "\01\00\00\00\0a\00\00\001\00.\000\00.\000")
  (data (;68;) (i32.const 3340) "\1c")
  (data (;69;) (i32.const 3352) "\01\00\00\00\06\00\00\00e\00n\00s")
  (data (;70;) (i32.const 3372) "\1c")
  (data (;71;) (i32.const 3384) "\01\00\00\00\04\00\00\00v\001")
  (data (;72;) (i32.const 3404) "\1c")
  (data (;73;) (i32.const 3416) "\01\00\00\00\0c\00\00\00e\00n\00s\00-\00v\001")
  (data (;74;) (i32.const 3436) ",")
  (data (;75;) (i32.const 3448) "\01\00\00\00\18\00\00\00a\00r\00b\00i\00t\00r\00u\00m\00-\00o\00n\00e")
  (data (;76;) (i32.const 3484) ",")
  (data (;77;) (i32.const 3496) "\01\00\00\00\18\00\00\00A\00R\00B\00I\00T\00R\00U\00M\00_\00O\00N\00E")
  (data (;78;) (i32.const 3532) "|")
  (data (;79;) (i32.const 3544) "\01\00\00\00^\00\00\00E\00l\00e\00m\00e\00n\00t\00 \00t\00y\00p\00e\00 \00m\00u\00s\00t\00 \00b\00e\00 \00n\00u\00l\00l\00a\00b\00l\00e\00 \00i\00f\00 \00a\00r\00r\00a\00y\00 \00i\00s\00 \00h\00o\00l\00e\00y")
  (data (;80;) (i32.const 3660) "<")
  (data (;81;) (i32.const 3672) "\01\00\00\00\1e\00\00\00a\00r\00w\00e\00a\00v\00e\00-\00m\00a\00i\00n\00n\00e\00t")
  (data (;82;) (i32.const 3724) "<")
  (data (;83;) (i32.const 3736) "\01\00\00\00\1e\00\00\00A\00R\00W\00E\00A\00V\00E\00_\00M\00A\00I\00N\00N\00E\00T")
  (data (;84;) (i32.const 3788) "\1c")
  (data (;85;) (i32.const 3800) "\01\00\00\00\0c\00\00\00a\00u\00r\00o\00r\00a")
  (data (;86;) (i32.const 3820) "\1c")
  (data (;87;) (i32.const 3832) "\01\00\00\00\0c\00\00\00A\00U\00R\00O\00R\00A")
  (data (;88;) (i32.const 3852) ",")
  (data (;89;) (i32.const 3864) "\01\00\00\00\12\00\00\00a\00v\00a\00l\00a\00n\00c\00h\00e")
  (data (;90;) (i32.const 3900) ",")
  (data (;91;) (i32.const 3912) "\01\00\00\00\12\00\00\00A\00V\00A\00L\00A\00N\00C\00H\00E")
  (data (;92;) (i32.const 3948) "\1c")
  (data (;93;) (i32.const 3960) "\01\00\00\00\08\00\00\00b\00o\00b\00a")
  (data (;94;) (i32.const 3980) "\1c")
  (data (;95;) (i32.const 3992) "\01\00\00\00\08\00\00\00B\00O\00B\00A")
  (data (;96;) (i32.const 4012) "\1c")
  (data (;97;) (i32.const 4024) "\01\00\00\00\06\00\00\00b\00s\00c")
  (data (;98;) (i32.const 4044) "\1c")
  (data (;99;) (i32.const 4056) "\01\00\00\00\06\00\00\00B\00S\00C")
  (data (;100;) (i32.const 4076) "\1c")
  (data (;101;) (i32.const 4088) "\01\00\00\00\08\00\00\00c\00e\00l\00o")
  (data (;102;) (i32.const 4108) "\1c")
  (data (;103;) (i32.const 4120) "\01\00\00\00\08\00\00\00C\00E\00L\00O")
  (data (;104;) (i32.const 4140) "\1c")
  (data (;105;) (i32.const 4152) "\01\00\00\00\0c\00\00\00C\00O\00S\00M\00O\00S")
  (data (;106;) (i32.const 4172) "\1c")
  (data (;107;) (i32.const 4184) "\01\00\00\00\0c\00\00\00C\00R\00O\00N\00O\00S")
  (data (;108;) (i32.const 4204) ",")
  (data (;109;) (i32.const 4216) "\01\00\00\00\0e\00\00\00M\00A\00I\00N\00N\00E\00T")
  (data (;110;) (i32.const 4252) "\1c")
  (data (;111;) (i32.const 4264) "\01\00\00\00\0c\00\00\00f\00a\00n\00t\00o\00m")
  (data (;112;) (i32.const 4284) "\1c")
  (data (;113;) (i32.const 4296) "\01\00\00\00\0c\00\00\00F\00A\00N\00T\00O\00M")
  (data (;114;) (i32.const 4316) "\1c")
  (data (;115;) (i32.const 4328) "\01\00\00\00\08\00\00\00f\00u\00s\00e")
  (data (;116;) (i32.const 4348) "\1c")
  (data (;117;) (i32.const 4360) "\01\00\00\00\08\00\00\00F\00U\00S\00E")
  (data (;118;) (i32.const 4380) ",")
  (data (;119;) (i32.const 4392) "\01\00\00\00\0e\00\00\00h\00a\00r\00m\00o\00n\00y")
  (data (;120;) (i32.const 4428) ",")
  (data (;121;) (i32.const 4440) "\01\00\00\00\0e\00\00\00H\00A\00R\00M\00O\00N\00Y")
  (data (;122;) (i32.const 4476) "\1c")
  (data (;123;) (i32.const 4488) "\01\00\00\00\08\00\00\00j\00u\00n\00o")
  (data (;124;) (i32.const 4508) "\1c")
  (data (;125;) (i32.const 4520) "\01\00\00\00\08\00\00\00J\00U\00N\00O")
  (data (;126;) (i32.const 4540) ",")
  (data (;127;) (i32.const 4552) "\01\00\00\00\10\00\00\00m\00o\00o\00n\00b\00e\00a\00m")
  (data (;128;) (i32.const 4588) ",")
  (data (;129;) (i32.const 4600) "\01\00\00\00\10\00\00\00M\00O\00O\00N\00B\00E\00A\00M")
  (data (;130;) (i32.const 4636) ",")
  (data (;131;) (i32.const 4648) "\01\00\00\00\12\00\00\00m\00o\00o\00n\00r\00i\00v\00e\00r")
  (data (;132;) (i32.const 4684) ",")
  (data (;133;) (i32.const 4696) "\01\00\00\00\12\00\00\00M\00O\00O\00N\00R\00I\00V\00E\00R")
  (data (;134;) (i32.const 4732) ",")
  (data (;135;) (i32.const 4744) "\01\00\00\00\18\00\00\00n\00e\00a\00r\00-\00m\00a\00i\00n\00n\00e\00t")
  (data (;136;) (i32.const 4780) ",")
  (data (;137;) (i32.const 4792) "\01\00\00\00\18\00\00\00N\00E\00A\00R\00_\00M\00A\00I\00N\00N\00E\00T")
  (data (;138;) (i32.const 4828) ",")
  (data (;139;) (i32.const 4840) "\01\00\00\00\10\00\00\00o\00p\00t\00i\00m\00i\00s\00m")
  (data (;140;) (i32.const 4876) ",")
  (data (;141;) (i32.const 4888) "\01\00\00\00\10\00\00\00O\00P\00T\00I\00M\00I\00S\00M")
  (data (;142;) (i32.const 4924) ",")
  (data (;143;) (i32.const 4936) "\01\00\00\00\0e\00\00\00o\00s\00m\00o\00s\00i\00s")
  (data (;144;) (i32.const 4972) ",")
  (data (;145;) (i32.const 4984) "\01\00\00\00\0e\00\00\00O\00S\00M\00O\00S\00I\00S")
  (data (;146;) (i32.const 5020) "\1c")
  (data (;147;) (i32.const 5032) "\01\00\00\00\0a\00\00\00m\00a\00t\00i\00c")
  (data (;148;) (i32.const 5052) "\1c")
  (data (;149;) (i32.const 5064) "\01\00\00\00\0a\00\00\00M\00A\00T\00I\00C")
  (data (;150;) (i32.const 5084) "\1c")
  (data (;151;) (i32.const 5096) "\01\00\00\00\08\00\00\00x\00d\00a\00i")
  (data (;152;) (i32.const 5116) "\1c")
  (data (;153;) (i32.const 5128) "\01\00\00\00\08\00\00\00X\00D\00A\00I")
  (data (;154;) (i32.const 5148) "l")
  (data (;155;) (i32.const 5160) "\01\00\00\00T\00\00\000\00x\005\007\00f\001\008\008\007\00a\008\00B\00F\001\009\00b\001\004\00f\00C\000\00d\00F\006\00F\00d\009\00B\002\00a\00c\00c\009\00A\00f\001\004\007\00e\00A\008\005")
  (data (;156;) (i32.const 5260) "\5c")
  (data (;157;) (i32.const 5272) "\01\00\00\00@\00\00\00U\00n\00i\00t\00 \00t\00e\00s\00t\00s\00 \00f\00o\00r\00 \00r\00e\00s\00o\00l\00v\00e\00r\00 \00h\00a\00n\00d\00l\00e\00r\00s")
  (data (;158;) (i32.const 5356) "\1c")
  (data (;159;) (i32.const 5368) "\12\00\00\00\08\00\00\00\01")
  (data (;160;) (i32.const 5388) ",")
  (data (;161;) (i32.const 5400) "\01\00\00\00\12\00\00\00a\00f\00t\00e\00r\00E\00a\00c\00h")
  (data (;162;) (i32.const 5436) "<")
  (data (;163;) (i32.const 5448) "\01\00\00\00,\00\00\00T\00e\00s\00t\00 \00h\00a\00n\00d\00l\00e\00A\00d\00d\00r\00C\00h\00a\00n\00g\00e\00d")
  (data (;164;) (i32.const 5500) "\9c")
  (data (;165;) (i32.const 5512) "\01\00\00\00\84\00\00\000\00x\00e\00a\006\00c\00c\008\004\003\00b\00b\00e\001\006\00a\001\008\00e\006\007\008\00f\007\000\005\000\00e\009\001\008\003\00f\000\009\00c\00c\00f\009\000\000\00a\003\00b\004\00b\007\004\00d\00e\001\002\00d\00a\00e\009\00c\00e\001\00f\009\005\00d\00f\00f\004")
  (data (;166;) (i32.const 5660) "l")
  (data (;167;) (i32.const 5672) "\01\00\00\00T\00\00\000\00x\000\008\004\00b\001\00c\003\00c\008\001\005\004\005\00d\003\007\000\00f\003\006\003\004\003\009\002\00d\00e\006\001\001\00c\00a\00a\00b\00f\00f\008\001\004\008")
  (data (;168;) (i32.const 5772) "\1c")
  (data (;169;) (i32.const 5804) "\9c")
  (data (;170;) (i32.const 5816) "\01\00\00\00\84\00\00\000\00x\007\000\001\006\003\003\008\005\004\00b\002\003\003\006\004\001\001\002\00e\008\005\002\008\00a\008\005\002\005\004\00a\000\003\009\00a\00b\00f\008\00d\001\00d\008\001\00d\006\002\009\00f\008\008\004\002\006\001\009\006\008\001\009\00e\000\00b\000\00b\005")
  (data (;171;) (i32.const 5964) "\1c")
  (data (;172;) (i32.const 5976) "\01\00\00\00\0c\00\00\00i\00n\00p\00u\00t\00 ")
  (data (;173;) (i32.const 5996) "<")
  (data (;174;) (i32.const 6008) "\01\00\00\00\1e\00\00\00 \00h\00a\00s\00 \00o\00d\00d\00 \00l\00e\00n\00g\00t\00h")
  (data (;175;) (i32.const 6060) "|")
  (data (;176;) (i32.const 6072) "\01\00\00\00d\00\00\00~\00l\00i\00b\00/\00@\00g\00r\00a\00p\00h\00p\00r\00o\00t\00o\00c\00o\00l\00/\00g\00r\00a\00p\00h\00-\00t\00s\00/\00c\00o\00m\00m\00o\00n\00/\00c\00o\00l\00l\00e\00c\00t\00i\00o\00n\00s\00.\00t\00s")
  (data (;177;) (i32.const 6188) "\1c")
  (data (;178;) (i32.const 6200) "\01\00\00\00\02\00\00\000")
  (data (;179;) (i32.const 6220) "\1c")
  (data (;180;) (i32.const 6232) "\01\00\00\00\02\00\00\00x")
  (data (;181;) (i32.const 6252) "\9c")
  (data (;182;) (i32.const 6264) "\01\00\00\00\84\00\00\000\00x\00a\00f\00b\006\00d\007\00a\00c\009\002\00f\006\00b\00e\00b\003\00f\003\00d\00f\006\00a\009\00b\00b\00f\00a\00e\00b\002\00f\009\009\00b\009\00d\00b\000\002\000\00e\00e\006\009\001\009\009\00a\00f\009\005\00f\002\00e\008\00e\00a\005\002\005\003\004\006\007")
  (data (;183;) (i32.const 6412) "l")
  (data (;184;) (i32.const 6424) "\01\00\00\00T\00\00\000\00x\003\001\004\001\005\009\002\006\005\00d\00d\008\00d\00b\00b\003\001\000\006\004\002\00f\009\008\00f\005\000\00c\000\006\006\001\007\003\00c\001\002\005\009\00b")
  (data (;185;) (i32.const 6524) "\1c")
  (data (;186;) (i32.const 6536) "\01\00\00\00\08\00\00\00n\00o\00d\00e")
  (data (;187;) (i32.const 6556) "\1c")
  (data (;188;) (i32.const 6568) "\01\00\00\00\02\00\00\00a")
  (data (;189;) (i32.const 6588) "\5c")
  (data (;190;) (i32.const 6600) "\01\00\00\00J\00\00\00A\00d\00d\00r\00e\00s\00s\00 \00m\00u\00s\00t\00 \00c\00o\00n\00t\00a\00i\00n\00 \00e\00x\00a\00c\00t\00l\00y\00 \002\000\00 \00b\00y\00t\00e\00s")
  (data (;191;) (i32.const 6684) "l")
  (data (;192;) (i32.const 6696) "\01\00\00\00\5c\00\00\00~\00l\00i\00b\00/\00@\00g\00r\00a\00p\00h\00p\00r\00o\00t\00o\00c\00o\00l\00/\00g\00r\00a\00p\00h\00-\00t\00s\00/\00c\00h\00a\00i\00n\00/\00e\00t\00h\00e\00r\00e\00u\00m\00.\00t\00s")
  (data (;193;) (i32.const 6796) "\8c")
  (data (;194;) (i32.const 6808) "\01\00\00\00p\00\00\00h\00a\00n\00d\00l\00e\00A\00d\00d\00r\00C\00h\00a\00n\00g\00e\00d\00:\00 \00n\00o\00d\00e\00 \00{\00}\00 \00a\00d\00d\00r\00 \00{\00}\00 \00r\00e\00s\00o\00l\00v\00e\00r\00 \00{\00}\00 \00t\00x\00h\00a\00s\00h\00 \00{\00}")
  (data (;195;) (i32.const 6940) "L")
  (data (;196;) (i32.const 6952) "\01\00\00\008\00\00\00E\00t\00h\00e\00r\00e\00u\00m\00 \00v\00a\00l\00u\00e\00 \00i\00s\00 \00n\00o\00t\00 \00b\00y\00t\00e\00s\00.")
  (data (;197;) (i32.const 7020) "\5c")
  (data (;198;) (i32.const 7032) "\01\00\00\00@\00\00\00E\00t\00h\00e\00r\00e\00u\00m\00 \00v\00a\00l\00u\00e\00 \00i\00s\00 \00n\00o\00t\00 \00a\00n\00 \00a\00d\00d\00r\00e\00s\00s")
  (data (;199;) (i32.const 7116) "\5c")
  (data (;200;) (i32.const 7128) "\01\00\00\00J\00\00\00T\00o\00o\00 \00f\00e\00w\00 \00a\00r\00g\00u\00m\00e\00n\00t\00s\00 \00f\00o\00r\00 \00f\00o\00r\00m\00a\00t\00 \00s\00t\00r\00i\00n\00g\00:\00 ")
  (data (;201;) (i32.const 7212) "\5c")
  (data (;202;) (i32.const 7224) "\01\00\00\00J\00\00\00~\00l\00i\00b\00/\00@\00g\00r\00a\00p\00h\00p\00r\00o\00t\00o\00c\00o\00l\00/\00g\00r\00a\00p\00h\00-\00t\00s\00/\00i\00n\00d\00e\00x\00.\00t\00s")
  (data (;203;) (i32.const 7308) "\1c")
  (data (;204;) (i32.const 7320) "\01\00\00\00\02\00\00\00-")
  (data (;205;) (i32.const 7340) ",")
  (data (;206;) (i32.const 7352) "\01\00\00\00\14\00\00\00A\00i\00r\00A\00c\00c\00o\00u\00n\00t")
  (data (;207;) (i32.const 7388) "\1c")
  (data (;208;) (i32.const 7400) "\01\00\00\00\04\00\00\00i\00d")
  (data (;209;) (i32.const 7420) ",")
  (data (;210;) (i32.const 7432) "\01\00\00\00\0e\00\00\00a\00d\00d\00r\00e\00s\00s")
  (data (;211;) (i32.const 7468) "l")
  (data (;212;) (i32.const 7480) "\01\00\00\00V\00\00\00C\00a\00n\00n\00o\00t\00 \00s\00a\00v\00e\00 \00A\00i\00r\00A\00c\00c\00o\00u\00n\00t\00 \00e\00n\00t\00i\00t\00y\00 \00w\00i\00t\00h\00o\00u\00t\00 \00a\00n\00 \00I\00D")
  (data (;213;) (i32.const 7580) "<")
  (data (;214;) (i32.const 7592) "\01\00\00\00&\00\00\00g\00e\00n\00e\00r\00a\00t\00e\00d\00/\00s\00c\00h\00e\00m\00a\00.\00t\00s")
  (data (;215;) (i32.const 7644) "\ac")
  (data (;216;) (i32.const 7656) "\01\00\00\00\8e\00\00\00E\00n\00t\00i\00t\00i\00e\00s\00 \00o\00f\00 \00t\00y\00p\00e\00 \00A\00i\00r\00A\00c\00c\00o\00u\00n\00t\00 \00m\00u\00s\00t\00 \00h\00a\00v\00e\00 \00a\00n\00 \00I\00D\00 \00o\00f\00 \00t\00y\00p\00e\00 \00S\00t\00r\00i\00n\00g\00 \00b\00u\00t\00 \00t\00h\00e\00 \00i\00d\00 \00'")
  (data (;217;) (i32.const 7820) ",")
  (data (;218;) (i32.const 7832) "\01\00\00\00\1a\00\00\00'\00 \00i\00s\00 \00o\00f\00 \00t\00y\00p\00e\00 ")
  (data (;219;) (i32.const 7868) ",")
  (data (;220;) (i32.const 7880) "\22\00\00\00\14\00\00\00\f0\1d\00\00\00\00\00\00\a0\1e\00\00\00\00\00\00\e0\0c")
  (data (;221;) (i32.const 7916) "<")
  (data (;222;) (i32.const 7928) "\01\00\00\00,\00\00\00V\00a\00l\00u\00e\00 \00i\00s\00 \00n\00o\00t\00 \00a\00 \00s\00t\00r\00i\00n\00g\00.")
  (data (;223;) (i32.const 7980) "l")
  (data (;224;) (i32.const 7992) "\01\00\00\00X\00\00\00~\00l\00i\00b\00/\00@\00g\00r\00a\00p\00h\00p\00r\00o\00t\00o\00c\00o\00l\00/\00g\00r\00a\00p\00h\00-\00t\00s\00/\00c\00o\00m\00m\00o\00n\00/\00v\00a\00l\00u\00e\00.\00t\00s")
  (data (;225;) (i32.const 8092) "<")
  (data (;226;) (i32.const 8104) "\01\00\00\00(\00\00\00V\00a\00l\00u\00e\00 \00i\00s\00 \00n\00o\00t\00 \00a\00n\00 \00i\003\002\00.")
  (data (;227;) (i32.const 8156) "|")
  (data (;228;) (i32.const 8168) "\01\00\00\00d\00\00\00t\00o\00S\00t\00r\00i\00n\00g\00(\00)\00 \00r\00a\00d\00i\00x\00 \00a\00r\00g\00u\00m\00e\00n\00t\00 \00m\00u\00s\00t\00 \00b\00e\00 \00b\00e\00t\00w\00e\00e\00n\00 \002\00 \00a\00n\00d\00 \003\006")
  (data (;229;) (i32.const 8284) "<")
  (data (;230;) (i32.const 8296) "\01\00\00\00&\00\00\00~\00l\00i\00b\00/\00u\00t\00i\00l\00/\00n\00u\00m\00b\00e\00r\00.\00t\00s")
  (data (;231;) (i32.const 8348) "0\000\000\001\000\002\000\003\000\004\000\005\000\006\000\007\000\008\000\009\001\000\001\001\001\002\001\003\001\004\001\005\001\006\001\007\001\008\001\009\002\000\002\001\002\002\002\003\002\004\002\005\002\006\002\007\002\008\002\009\003\000\003\001\003\002\003\003\003\004\003\005\003\006\003\007\003\008\003\009\004\000\004\001\004\002\004\003\004\004\004\005\004\006\004\007\004\008\004\009\005\000\005\001\005\002\005\003\005\004\005\005\005\006\005\007\005\008\005\009\006\000\006\001\006\002\006\003\006\004\006\005\006\006\006\007\006\008\006\009\007\000\007\001\007\002\007\003\007\004\007\005\007\006\007\007\007\008\007\009\008\000\008\001\008\002\008\003\008\004\008\005\008\006\008\007\008\008\008\009\009\000\009\001\009\002\009\003\009\004\009\005\009\006\009\007\009\008\009\009")
  (data (;232;) (i32.const 8748) "\1c\04")
  (data (;233;) (i32.const 8760) "\01\00\00\00\00\04\00\000\000\000\001\000\002\000\003\000\004\000\005\000\006\000\007\000\008\000\009\000\00a\000\00b\000\00c\000\00d\000\00e\000\00f\001\000\001\001\001\002\001\003\001\004\001\005\001\006\001\007\001\008\001\009\001\00a\001\00b\001\00c\001\00d\001\00e\001\00f\002\000\002\001\002\002\002\003\002\004\002\005\002\006\002\007\002\008\002\009\002\00a\002\00b\002\00c\002\00d\002\00e\002\00f\003\000\003\001\003\002\003\003\003\004\003\005\003\006\003\007\003\008\003\009\003\00a\003\00b\003\00c\003\00d\003\00e\003\00f\004\000\004\001\004\002\004\003\004\004\004\005\004\006\004\007\004\008\004\009\004\00a\004\00b\004\00c\004\00d\004\00e\004\00f\005\000\005\001\005\002\005\003\005\004\005\005\005\006\005\007\005\008\005\009\005\00a\005\00b\005\00c\005\00d\005\00e\005\00f\006\000\006\001\006\002\006\003\006\004\006\005\006\006\006\007\006\008\006\009\006\00a\006\00b\006\00c\006\00d\006\00e\006\00f\007\000\007\001\007\002\007\003\007\004\007\005\007\006\007\007\007\008\007\009\007\00a\007\00b\007\00c\007\00d\007\00e\007\00f\008\000\008\001\008\002\008\003\008\004\008\005\008\006\008\007\008\008\008\009\008\00a\008\00b\008\00c\008\00d\008\00e\008\00f\009\000\009\001\009\002\009\003\009\004\009\005\009\006\009\007\009\008\009\009\009\00a\009\00b\009\00c\009\00d\009\00e\009\00f\00a\000\00a\001\00a\002\00a\003\00a\004\00a\005\00a\006\00a\007\00a\008\00a\009\00a\00a\00a\00b\00a\00c\00a\00d\00a\00e\00a\00f\00b\000\00b\001\00b\002\00b\003\00b\004\00b\005\00b\006\00b\007\00b\008\00b\009\00b\00a\00b\00b\00b\00c\00b\00d\00b\00e\00b\00f\00c\000\00c\001\00c\002\00c\003\00c\004\00c\005\00c\006\00c\007\00c\008\00c\009\00c\00a\00c\00b\00c\00c\00c\00d\00c\00e\00c\00f\00d\000\00d\001\00d\002\00d\003\00d\004\00d\005\00d\006\00d\007\00d\008\00d\009\00d\00a\00d\00b\00d\00c\00d\00d\00d\00e\00d\00f\00e\000\00e\001\00e\002\00e\003\00e\004\00e\005\00e\006\00e\007\00e\008\00e\009\00e\00a\00e\00b\00e\00c\00e\00d\00e\00e\00e\00f\00f\000\00f\001\00f\002\00f\003\00f\004\00f\005\00f\006\00f\007\00f\008\00f\009\00f\00a\00f\00b\00f\00c\00f\00d\00f\00e\00f\00f")
  (data (;234;) (i32.const 9804) "\5c")
  (data (;235;) (i32.const 9816) "\01\00\00\00H\00\00\000\001\002\003\004\005\006\007\008\009\00a\00b\00c\00d\00e\00f\00g\00h\00i\00j\00k\00l\00m\00n\00o\00p\00q\00r\00s\00t\00u\00v\00w\00x\00y\00z")
  (data (;236;) (i32.const 9900) "L")
  (data (;237;) (i32.const 9912) "\01\00\00\004\00\00\00V\00a\00l\00u\00e\00 \00i\00s\00 \00n\00o\00t\00 \00a\00 \00B\00i\00g\00D\00e\00c\00i\00m\00a\00l\00.")
  (data (;238;) (i32.const 9980) "L")
  (data (;239;) (i32.const 9992) "\01\00\00\00.\00\00\00V\00a\00l\00u\00e\00 \00i\00s\00 \00n\00o\00t\00 \00a\00 \00b\00o\00o\00l\00e\00a\00n\00.")
  (data (;240;) (i32.const 10060) "\1c")
  (data (;241;) (i32.const 10072) "\01\00\00\00\08\00\00\00t\00r\00u\00e")
  (data (;242;) (i32.const 10092) "\1c")
  (data (;243;) (i32.const 10104) "\01\00\00\00\0a\00\00\00f\00a\00l\00s\00e")
  (data (;244;) (i32.const 10124) "<")
  (data (;245;) (i32.const 10136) "\01\00\00\00,\00\00\00V\00a\00l\00u\00e\00 \00i\00s\00 \00n\00o\00t\00 \00a\00n\00 \00a\00r\00r\00a\00y\00.")
  (data (;246;) (i32.const 10188) "\1c")
  (data (;247;) (i32.const 10200) "\01\00\00\00\02\00\00\00[")
  (data (;248;) (i32.const 10220) "\1c")
  (data (;249;) (i32.const 10232) "%\00\00\00\08\00\00\00\02")
  (data (;250;) (i32.const 10252) "\1c")
  (data (;251;) (i32.const 10264) "\01\00\00\00\04\00\00\00,\00 ")
  (data (;252;) (i32.const 10284) "\1c")
  (data (;253;) (i32.const 10296) "\01\00\00\00\02\00\00\00]")
  (data (;254;) (i32.const 10316) "L")
  (data (;255;) (i32.const 10328) "\01\00\00\004\00\00\00V\00a\00l\00u\00e\00 \00i\00s\00 \00n\00o\00t\00 \00a\00 \00b\00y\00t\00e\00 \00a\00r\00r\00a\00y\00.")
  (data (;256;) (i32.const 10396) "<")
  (data (;257;) (i32.const 10408) "\01\00\00\00,\00\00\00V\00a\00l\00u\00e\00 \00i\00s\00 \00n\00o\00t\00 \00a\00 \00B\00i\00g\00I\00n\00t\00.")
  (data (;258;) (i32.const 10460) "<")
  (data (;259;) (i32.const 10472) "\01\00\00\00*\00\00\00U\00n\00k\00n\00o\00w\00n\00 \00d\00a\00t\00a\00 \00(\00k\00i\00n\00d\00 \00=\00 ")
  (data (;260;) (i32.const 10524) "\1c")
  (data (;261;) (i32.const 10536) "\01\00\00\00\02\00\00\00)")
  (data (;262;) (i32.const 10556) "\1c")
  (data (;263;) (i32.const 10568) "\22\00\00\00\0c\00\00\00\f0(\00\00\00\00\00\000)")
  (data (;264;) (i32.const 10588) ",")
  (data (;265;) (i32.const 10600) "\01\00\00\00\12\00\00\00U\00n\00k\00n\00o\00w\00n\00 \00(")
  (data (;266;) (i32.const 10636) "\1c")
  (data (;267;) (i32.const 10648) "\22\00\00\00\0c\00\00\00p)\00\00\00\00\00\000)")
  (data (;268;) (i32.const 10668) ",")
  (data (;269;) (i32.const 10680) "\01\00\00\00\10\00\00\00A\00i\00r\00B\00l\00o\00c\00k")
  (data (;270;) (i32.const 10716) "\1c")
  (data (;271;) (i32.const 10728) "\01\00\00\00\08\00\00\00h\00a\00s\00h")
  (data (;272;) (i32.const 10748) "\1c")
  (data (;273;) (i32.const 10760) "\01\00\00\00\0c\00\00\00n\00u\00m\00b\00e\00r")
  (data (;274;) (i32.const 10780) ",")
  (data (;275;) (i32.const 10792) "\01\00\00\00\12\00\00\00t\00i\00m\00e\00s\00t\00a\00m\00p")
  (data (;276;) (i32.const 10828) "l")
  (data (;277;) (i32.const 10840) "\01\00\00\00R\00\00\00C\00a\00n\00n\00o\00t\00 \00s\00a\00v\00e\00 \00A\00i\00r\00B\00l\00o\00c\00k\00 \00e\00n\00t\00i\00t\00y\00 \00w\00i\00t\00h\00o\00u\00t\00 \00a\00n\00 \00I\00D")
  (data (;278;) (i32.const 10940) "\9c")
  (data (;279;) (i32.const 10952) "\01\00\00\00\8a\00\00\00E\00n\00t\00i\00t\00i\00e\00s\00 \00o\00f\00 \00t\00y\00p\00e\00 \00A\00i\00r\00B\00l\00o\00c\00k\00 \00m\00u\00s\00t\00 \00h\00a\00v\00e\00 \00a\00n\00 \00I\00D\00 \00o\00f\00 \00t\00y\00p\00e\00 \00S\00t\00r\00i\00n\00g\00 \00b\00u\00t\00 \00t\00h\00e\00 \00i\00d\00 \00'")
  (data (;280;) (i32.const 11100) ",")
  (data (;281;) (i32.const 11112) "\22\00\00\00\14\00\00\00\d0*\00\00\00\00\00\00\a0\1e\00\00\00\00\00\00\e0\0c")
  (data (;282;) (i32.const 11148) ",")
  (data (;283;) (i32.const 11160) "\01\00\00\00\12\00\00\00A\00i\00r\00D\00o\00m\00a\00i\00n")
  (data (;284;) (i32.const 11196) ",")
  (data (;285;) (i32.const 11208) "\01\00\00\00\1c\00\00\00s\00u\00b\00d\00o\00m\00a\00i\00n\00C\00o\00u\00n\00t")
  (data (;286;) (i32.const 11244) "<")
  (data (;287;) (i32.const 11256) "\01\00\00\00\1e\00\00\00u\00n\00e\00x\00p\00e\00c\00t\00e\00d\00 \00n\00u\00l\00l")
  (data (;288;) (i32.const 11308) "\1c")
  (data (;289;) (i32.const 11320) "\01\00\00\00\0a\00\00\00o\00w\00n\00e\00r")
  (data (;290;) (i32.const 11340) ",")
  (data (;291;) (i32.const 11352) "\01\00\00\00\10\00\00\00A\00i\00r\00T\00o\00k\00e\00n")
  (data (;292;) (i32.const 11388) "l")
  (data (;293;) (i32.const 11400) "\01\00\00\00R\00\00\00C\00a\00n\00n\00o\00t\00 \00s\00a\00v\00e\00 \00A\00i\00r\00T\00o\00k\00e\00n\00 \00e\00n\00t\00i\00t\00y\00 \00w\00i\00t\00h\00o\00u\00t\00 \00a\00n\00 \00I\00D")
  (data (;294;) (i32.const 11500) "\9c")
  (data (;295;) (i32.const 11512) "\01\00\00\00\8a\00\00\00E\00n\00t\00i\00t\00i\00e\00s\00 \00o\00f\00 \00t\00y\00p\00e\00 \00A\00i\00r\00T\00o\00k\00e\00n\00 \00m\00u\00s\00t\00 \00h\00a\00v\00e\00 \00a\00n\00 \00I\00D\00 \00o\00f\00 \00t\00y\00p\00e\00 \00S\00t\00r\00i\00n\00g\00 \00b\00u\00t\00 \00t\00h\00e\00 \00i\00d\00 \00'")
  (data (;296;) (i32.const 11660) ",")
  (data (;297;) (i32.const 11672) "\22\00\00\00\14\00\00\00\00-\00\00\00\00\00\00\a0\1e\00\00\00\00\00\00\e0\0c")
  (data (;298;) (i32.const 11708) ",")
  (data (;299;) (i32.const 11720) "\01\00\00\00\18\00\00\00t\00o\00k\00e\00n\00A\00d\00d\00r\00e\00s\00s")
  (data (;300;) (i32.const 11756) ",")
  (data (;301;) (i32.const 11768) "\01\00\00\00\12\00\00\00i\00s\00P\00r\00i\00m\00a\00r\00y")
  (data (;302;) (i32.const 11804) ",")
  (data (;303;) (i32.const 11816) "\01\00\00\00\14\00\00\00i\00s\00M\00i\00g\00r\00a\00t\00e\00d")
  (data (;304;) (i32.const 11852) "<")
  (data (;305;) (i32.const 11864) "\01\00\00\00\1e\00\00\00e\00x\00p\00i\00r\00y\00T\00i\00m\00e\00s\00t\00a\00m\00p")
  (data (;306;) (i32.const 11916) "<")
  (data (;307;) (i32.const 11928) "\01\00\00\00 \00\00\00r\00e\00g\00i\00s\00t\00r\00a\00t\00i\00o\00n\00C\00o\00s\00t")
  (data (;308;) (i32.const 11980) ",")
  (data (;309;) (i32.const 11992) "\01\00\00\00\12\00\00\00c\00r\00e\00a\00t\00e\00d\00A\00t")
  (data (;310;) (i32.const 12028) ",")
  (data (;311;) (i32.const 12040) "\01\00\00\00\12\00\00\00l\00a\00s\00t\00B\00l\00o\00c\00k")
  (data (;312;) (i32.const 12076) "l")
  (data (;313;) (i32.const 12088) "\01\00\00\00T\00\00\00C\00a\00n\00n\00o\00t\00 \00s\00a\00v\00e\00 \00A\00i\00r\00D\00o\00m\00a\00i\00n\00 \00e\00n\00t\00i\00t\00y\00 \00w\00i\00t\00h\00o\00u\00t\00 \00a\00n\00 \00I\00D")
  (data (;314;) (i32.const 12188) "\9c")
  (data (;315;) (i32.const 12200) "\01\00\00\00\8c\00\00\00E\00n\00t\00i\00t\00i\00e\00s\00 \00o\00f\00 \00t\00y\00p\00e\00 \00A\00i\00r\00D\00o\00m\00a\00i\00n\00 \00m\00u\00s\00t\00 \00h\00a\00v\00e\00 \00a\00n\00 \00I\00D\00 \00o\00f\00 \00t\00y\00p\00e\00 \00S\00t\00r\00i\00n\00g\00 \00b\00u\00t\00 \00t\00h\00e\00 \00i\00d\00 \00'")
  (data (;316;) (i32.const 12348) ",")
  (data (;317;) (i32.const 12360) "\22\00\00\00\14\00\00\00\b0/\00\00\00\00\00\00\a0\1e\00\00\00\00\00\00\e0\0c")
  (data (;318;) (i32.const 12396) "<")
  (data (;319;) (i32.const 12408) "\01\00\00\00\1e\00\00\00r\00e\00s\00o\00l\00v\00e\00d\00A\00d\00d\00r\00e\00s\00s")
  (data (;320;) (i32.const 12460) ",")
  (data (;321;) (i32.const 12472) "\01\00\00\00\16\00\00\00A\00i\00r\00R\00e\00s\00o\00l\00v\00e\00r")
  (data (;322;) (i32.const 12508) "\1c")
  (data (;323;) (i32.const 12520) "\01\00\00\00\0c\00\00\00d\00o\00m\00a\00i\00n")
  (data (;324;) (i32.const 12540) "l")
  (data (;325;) (i32.const 12552) "\01\00\00\00X\00\00\00C\00a\00n\00n\00o\00t\00 \00s\00a\00v\00e\00 \00A\00i\00r\00R\00e\00s\00o\00l\00v\00e\00r\00 \00e\00n\00t\00i\00t\00y\00 \00w\00i\00t\00h\00o\00u\00t\00 \00a\00n\00 \00I\00D")
  (data (;326;) (i32.const 12652) "\ac")
  (data (;327;) (i32.const 12664) "\01\00\00\00\90\00\00\00E\00n\00t\00i\00t\00i\00e\00s\00 \00o\00f\00 \00t\00y\00p\00e\00 \00A\00i\00r\00R\00e\00s\00o\00l\00v\00e\00r\00 \00m\00u\00s\00t\00 \00h\00a\00v\00e\00 \00a\00n\00 \00I\00D\00 \00o\00f\00 \00t\00y\00p\00e\00 \00S\00t\00r\00i\00n\00g\00 \00b\00u\00t\00 \00t\00h\00e\00 \00i\00d\00 \00'")
  (data (;328;) (i32.const 12828) ",")
  (data (;329;) (i32.const 12840) "\22\00\00\00\14\00\00\00\801\00\00\00\00\00\00\a0\1e\00\00\00\00\00\00\e0\0c")
  (data (;330;) (i32.const 12876) ",")
  (data (;331;) (i32.const 12888) "\01\00\00\00\10\00\00\00r\00e\00s\00o\00l\00v\00e\00r")
  (data (;332;) (i32.const 12924) ",")
  (data (;333;) (i32.const 12936) "\01\00\00\00\1c\00\00\00A\00i\00r\00A\00d\00d\00r\00C\00h\00a\00n\00g\00e\00d")
  (data (;334;) (i32.const 12972) "\1c")
  (data (;335;) (i32.const 12984) "\01\00\00\00\0a\00\00\00b\00l\00o\00c\00k")
  (data (;336;) (i32.const 13004) "<")
  (data (;337;) (i32.const 13016) "\01\00\00\00\1e\00\00\00t\00r\00a\00n\00s\00a\00c\00t\00i\00o\00n\00H\00a\00s\00h")
  (data (;338;) (i32.const 13068) "L")
  (data (;339;) (i32.const 13080) "\01\00\00\00.\00\00\00p\00r\00e\00v\00i\00o\00u\00s\00R\00e\00s\00o\00l\00v\00e\00d\00A\00d\00d\00r\00e\00s\00s")
  (data (;340;) (i32.const 13148) "<")
  (data (;341;) (i32.const 13160) "\01\00\00\00$\00\00\00n\00e\00w\00R\00e\00s\00o\00l\00v\00e\00d\00A\00d\00d\00r\00e\00s\00s")
  (data (;342;) (i32.const 13212) ",")
  (data (;343;) (i32.const 13224) "\01\00\00\00\0e\00\00\00t\00o\00k\00e\00n\00I\00d")
  (data (;344;) (i32.const 13260) "<")
  (data (;345;) (i32.const 13272) "\01\00\00\00 \00\00\00A\00i\00r\00E\00n\00t\00i\00t\00y\00C\00o\00u\00n\00t\00e\00r")
  (data (;346;) (i32.const 13324) "\1c")
  (data (;347;) (i32.const 13336) "\01\00\00\00\0a\00\00\00c\00o\00u\00n\00t")
  (data (;348;) (i32.const 13356) ",")
  (data (;349;) (i32.const 13368) "\01\00\00\00\1a\00\00\00l\00a\00s\00t\00U\00p\00d\00a\00t\00e\00d\00A\00t")
  (data (;350;) (i32.const 13404) ",")
  (data (;351;) (i32.const 13416) "\01\00\00\00\0e\00\00\00A\00i\00r\00M\00e\00t\00a")
  (data (;352;) (i32.const 13452) ",")
  (data (;353;) (i32.const 13464) "\01\00\00\00\0e\00\00\00u\00n\00k\00n\00o\00w\00n")
  (data (;354;) (i32.const 13500) ",")
  (data (;355;) (i32.const 13512) "\01\00\00\00\0e\00\00\00n\00e\00t\00w\00o\00r\00k")
  (data (;356;) (i32.const 13548) ",")
  (data (;357;) (i32.const 13560) "\01\00\00\00\1a\00\00\00s\00c\00h\00e\00m\00a\00V\00e\00r\00s\00i\00o\00n")
  (data (;358;) (i32.const 13596) ",")
  (data (;359;) (i32.const 13608) "\01\00\00\00\0e\00\00\00v\00e\00r\00s\00i\00o\00n")
  (data (;360;) (i32.const 13644) "\1c")
  (data (;361;) (i32.const 13656) "\01\00\00\00\08\00\00\00s\00l\00u\00g")
  (data (;362;) (i32.const 13676) "\1c")
  (data (;363;) (i32.const 13688) "\01\00\00\00\08\00\00\00n\00a\00m\00e")
  (data (;364;) (i32.const 13708) "l")
  (data (;365;) (i32.const 13720) "\01\00\00\00P\00\00\00C\00a\00n\00n\00o\00t\00 \00s\00a\00v\00e\00 \00A\00i\00r\00M\00e\00t\00a\00 \00e\00n\00t\00i\00t\00y\00 \00w\00i\00t\00h\00o\00u\00t\00 \00a\00n\00 \00I\00D")
  (data (;366;) (i32.const 13820) "\9c")
  (data (;367;) (i32.const 13832) "\01\00\00\00\88\00\00\00E\00n\00t\00i\00t\00i\00e\00s\00 \00o\00f\00 \00t\00y\00p\00e\00 \00A\00i\00r\00M\00e\00t\00a\00 \00m\00u\00s\00t\00 \00h\00a\00v\00e\00 \00a\00n\00 \00I\00D\00 \00o\00f\00 \00t\00y\00p\00e\00 \00S\00t\00r\00i\00n\00g\00 \00b\00u\00t\00 \00t\00h\00e\00 \00i\00d\00 \00'")
  (data (;368;) (i32.const 13980) ",")
  (data (;369;) (i32.const 13992) "\22\00\00\00\14\00\00\00\106\00\00\00\00\00\00\a0\1e\00\00\00\00\00\00\e0\0c")
  (data (;370;) (i32.const 14028) "|")
  (data (;371;) (i32.const 14040) "\01\00\00\00l\00\00\00F\00a\00i\00l\00e\00d\00 \00t\00o\00 \00s\00u\00m\00 \00B\00i\00g\00I\00n\00t\00s\00 \00b\00e\00c\00a\00u\00s\00e\00 \00l\00e\00f\00t\00 \00h\00a\00n\00d\00 \00s\00i\00d\00e\00 \00i\00s\00 \00'\00n\00u\00l\00l\00'")
  (data (;372;) (i32.const 14156) "l")
  (data (;373;) (i32.const 14168) "\01\00\00\00\5c\00\00\00~\00l\00i\00b\00/\00@\00g\00r\00a\00p\00h\00p\00r\00o\00t\00o\00c\00o\00l\00/\00g\00r\00a\00p\00h\00-\00t\00s\00/\00c\00o\00m\00m\00o\00n\00/\00n\00u\00m\00b\00e\00r\00s\00.\00t\00s")
  (data (;374;) (i32.const 14268) "|")
  (data (;375;) (i32.const 14280) "\01\00\00\00b\00\00\00C\00a\00n\00n\00o\00t\00 \00s\00a\00v\00e\00 \00A\00i\00r\00E\00n\00t\00i\00t\00y\00C\00o\00u\00n\00t\00e\00r\00 \00e\00n\00t\00i\00t\00y\00 \00w\00i\00t\00h\00o\00u\00t\00 \00a\00n\00 \00I\00D")
  (data (;376;) (i32.const 14396) "\ac")
  (data (;377;) (i32.const 14408) "\01\00\00\00\9a\00\00\00E\00n\00t\00i\00t\00i\00e\00s\00 \00o\00f\00 \00t\00y\00p\00e\00 \00A\00i\00r\00E\00n\00t\00i\00t\00y\00C\00o\00u\00n\00t\00e\00r\00 \00m\00u\00s\00t\00 \00h\00a\00v\00e\00 \00a\00n\00 \00I\00D\00 \00o\00f\00 \00t\00y\00p\00e\00 \00S\00t\00r\00i\00n\00g\00 \00b\00u\00t\00 \00t\00h\00e\00 \00i\00d\00 \00'")
  (data (;378;) (i32.const 14572) ",")
  (data (;379;) (i32.const 14584) "\22\00\00\00\14\00\00\00P8\00\00\00\00\00\00\a0\1e\00\00\00\00\00\00\e0\0c")
  (data (;380;) (i32.const 14620) "\1c")
  (data (;381;) (i32.const 14632) "\01\00\00\00\0a\00\00\00i\00n\00d\00e\00x")
  (data (;382;) (i32.const 14652) "|")
  (data (;383;) (i32.const 14664) "\01\00\00\00^\00\00\00C\00a\00n\00n\00o\00t\00 \00s\00a\00v\00e\00 \00A\00i\00r\00A\00d\00d\00r\00C\00h\00a\00n\00g\00e\00d\00 \00e\00n\00t\00i\00t\00y\00 \00w\00i\00t\00h\00o\00u\00t\00 \00a\00n\00 \00I\00D")
  (data (;384;) (i32.const 14780) "\ac")
  (data (;385;) (i32.const 14792) "\01\00\00\00\96\00\00\00E\00n\00t\00i\00t\00i\00e\00s\00 \00o\00f\00 \00t\00y\00p\00e\00 \00A\00i\00r\00A\00d\00d\00r\00C\00h\00a\00n\00g\00e\00d\00 \00m\00u\00s\00t\00 \00h\00a\00v\00e\00 \00a\00n\00 \00I\00D\00 \00o\00f\00 \00t\00y\00p\00e\00 \00S\00t\00r\00i\00n\00g\00 \00b\00u\00t\00 \00t\00h\00e\00 \00i\00d\00 \00'")
  (data (;386;) (i32.const 14956) ",")
  (data (;387;) (i32.const 14968) "\22\00\00\00\14\00\00\00\d09\00\00\00\00\00\00\a0\1e\00\00\00\00\00\00\e0\0c")
  (data (;388;) (i32.const 15004) "<")
  (data (;389;) (i32.const 15016) "\01\00\00\00\1e\00\00\00A\00s\00s\00e\00r\00t\00i\00o\00n\00 \00E\00r\00r\00o\00r")
  (data (;390;) (i32.const 15068) "\5c")
  (data (;391;) (i32.const 15080) "\01\00\00\00J\00\00\00~\00l\00i\00b\00/\00m\00a\00t\00c\00h\00s\00t\00i\00c\00k\00-\00a\00s\00/\00a\00s\00s\00e\00m\00b\00l\00y\00/\00a\00s\00s\00e\00r\00t\00.\00t\00s")
  (data (;392;) (i32.const 15164) "\1c")
  (data (;393;) (i32.const 15176) "\12\00\00\00\08\00\00\00\03")
  (data (;394;) (i32.const 15196) "L")
  (data (;395;) (i32.const 15208) "\01\00\00\002\00\00\00t\00e\00s\00t\00 \00h\00a\00n\00d\00l\00e\00V\00e\00r\00s\00i\00o\00n\00C\00h\00a\00n\00g\00e\00d")
  (data (;396;) (i32.const 15276) "|")
  (data (;397;) (i32.const 15288) "\01\00\00\00f\00\00\00h\00a\00n\00d\00l\00e\00V\00e\00r\00s\00i\00o\00n\00C\00h\00a\00n\00g\00e\00d\00:\00 \00n\00o\00d\00e\00 \00{\00}\00 \00r\00e\00s\00o\00l\00v\00e\00r\00 \00{\00}\00 \00t\00x\00h\00a\00s\00h\00 \00{\00}")
  (data (;398;) (i32.const 15404) "\1c")
  (data (;399;) (i32.const 15416) "\12\00\00\00\08\00\00\00\04")
  (data (;400;) (i32.const 15436) "\1c")
  (data (;401;) (i32.const 15448) "\12\00\00\00\08\00\00\00\05")
  (data (;402;) (i32.const 15468) "<")
  (data (;403;) (i32.const 15484) " \00\00\00\a0\04\00\00\c0\04\00\00\e0\04\00\00\10\05\00\000\05\00\00P\05\00\00p\05\00\00\90\05")
  (data (;404;) (i32.const 15532) ",")
  (data (;405;) (i32.const 15544) "\03\00\00\00\10\00\00\00\80<\00\00\80<\00\00 \00\00\00\08"))
