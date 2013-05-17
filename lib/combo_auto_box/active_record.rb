require 'active_support'
require 'active_record'

module ComboAutoBox #:nodoc:
  module ActiveRecord
    module ClassMethods
      def has_combo_auto_box(options = {})
        after_save :delete_combo_auto_box_cache
        after_destroy :delete_combo_auto_box_cache
        
        @options = options.symbolize_keys
        @options[:term] ||= 'label' 
        @options[:id] ||= 'id'
        @options[:order] ||= @options[:term].split(/\s+/).first

        term_for_select = @options[:term].match(/AS label\s*$/i).nil? ? "#{@options[:term]} AS label" : @options[:term]
        id_for_select = @options[:id].match(/AS id\s*$/i).nil? ? "#{@options[:id]} AS id" : @options[:id]
        @options[:select] = "#{id_for_select}, #{term_for_select}"

        class << self
          define_method("combo_auto_box") do |term = '', params = {}|
            Rails.cache.fetch(["combo-auto-box-#{self.to_s.parameterize}-search", term, params.sort].flatten) do
              criteria = Hash.new
              criteria["#{@options[:term]} LIKE ?"] = "%#{term}%"
              params = params.stringify_keys
              self.attribute_names.each do |key|
                criteria["#{key} = ?"] = params[key] if !params[key].nil?
              end
            
              self.select(@options[:select]).where([criteria.keys.join(' AND '), criteria.values].flatten).order(@options[:order])
            end
          end
        end
        
        include InstanceMethods
      end      
    end

    module InstanceMethods #:nodoc:
      def delete_combo_auto_box_cache
        regexp = Regexp.new("combo-auto-box-#{self.class.to_s.parameterize}-search")
        Rails.cache.delete_matched(regexp)
      end
    end

    # mix into Active Record
    ::ActiveRecord::Base.extend ClassMethods
  end
end